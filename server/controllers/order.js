const Order = require("../models/Order");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const multer = require("multer");
const sharp = require("sharp");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignUrl, getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

const randomImageName = () => crypto.randomBytes(32).toString("hex");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
  },
  region: process.env.BUCKET_REGION,
});

exports.multerConfig = {
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith("image/");
    if (image) {
      next(null, true);
    } else {
      return next();
    }
  },
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const {
    storeLocation,
    designer,
    clientName,
    dueDate,
    productType,
    ringSize,
    necklaceLength,
    braceletLength,
    chainType,
    material,
    goldColor,
    serialNumber,
    salePrice,
  } = req.body;

  if (
    !storeLocation ||
    !designer ||
    !dueDate ||
    !productType ||
    !material ||
    !salePrice
  )
    return next(new AppError("Please fill all the required fields!", 400));

  const imageName = randomImageName();

  let orderProperties = {
    image: imageName,
    storeLocation,
    owner: req.user._id,
    designer,
    clientName,
    dueDate,
    productType,
    material,
    salePrice,
    serialNumber,
  };

  if (productType === "Ring" && material.split(" ")[1] === "Gold") {
    orderProperties = {
      ...orderProperties,
      ringSize,
      goldColor,
    };
  }
  if (productType === "Ring" && material.split(" ")[1] !== "Gold") {
    orderProperties = {
      ...orderProperties,
      ringSize,
    };
  }
  if (productType === "Bracelet" && material.split(" ")[1] === "Gold") {
    orderProperties = {
      ...orderProperties,
      braceletLength,
      goldColor,
    };
  }
  if (productType === "Bracelet" && material.split(" ")[1] !== "Gold") {
    orderProperties = {
      ...orderProperties,
      braceletLength,
    };
  }
  if (productType === "Necklace" && material.split(" ")[1] === "Gold") {
    orderProperties = {
      ...orderProperties,
      necklaceLength,
      goldColor,
    };
  }
  if (productType === "Necklace" && material.split(" ")[1] !== "Gold") {
    orderProperties = {
      ...orderProperties,
      necklaceLength,
    };
  }

  if (productType === "Pendant" && material.split(" ")[1] === "Gold") {
    orderProperties = {
      ...orderProperties,
      chainType,
      goldColor,
    };
  }
  if (productType === "Pendant" && material.split(" ")[1] !== "Gold") {
    orderProperties = {
      ...orderProperties,
      chainType,
    };
  }

  if (
    productType !== "Necklace" &&
    productType !== "Bracelet" &&
    productType !== "Ring" &&
    material.split(" ")[1] === "Gold"
  ) {
    orderProperties = {
      ...orderProperties,
      goldColor,
    };
  }

  const buffer = await sharp(req.file.buffer)
    .resize({ height: 500, width: 500, fit: "contain" })
    .toBuffer();

  const order = new Order(orderProperties);
  await order.save();

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: imageName,
    Body: buffer,
    ContentType: req.file.mimetype,
  };

  const command = new PutObjectCommand(params);

  await s3.send(command);

  res.status(201).json({
    message: "Order created.",
    order,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      image: Date.now() + "." + req.file.originalname,
      name: req.body.name,
      owner: req.user._id,
      designer: req.body.designer,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!order) return next(new AppError("No order found with that Id", 404));
  res.status(200).json({
    status: "success",
    data: {
      data: order,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return next(new AppError("No order found with that Id", 404));

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: order.image,
  };

  const command = new DeleteObjectCommand(params);

  await s3.send(command);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (!order) return next(new AppError("There is no such order!", 404));

  let getObjectParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: order.image,
  };
  let command = new GetObjectCommand(getObjectParams);
  let url = await getSignedUrl(s3, command, { expiresIn: 86400 }); // the url expires in 1 day
  order.imageUrl = url;
  await order.save();

  res.status(200).json({
    order,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({});

  if (!orders.length)
    return res.status(200).json({
      message: "There are no available orders!",
    });

  for await (let order of orders) {
    let getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: order.image,
    };
    let command = new GetObjectCommand(getObjectParams);
    let url = await getSignedUrl(s3, command, { expiresIn: 86400 }); // the url expires in 1 day
    order.imageUrl = url;
    await order.save();
  }

  res.status(200).json({
    count: orders.length,
    orders,
  });
});
