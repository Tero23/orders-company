const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { createSendToken } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");

exports.createUser = catchAsync(async (req, res, next) => {
  const {
    email,
    firstName,
    lastName,
    phone,
    location,
    role,
    password,
    passwordConfirm,
  } = req.body;
  if (
    !email ||
    !firstName ||
    !lastName ||
    !phone ||
    !location ||
    !password ||
    !passwordConfirm
  )
    return next(new AppError("Please fill all the required fields!"), 400);
  const user = await User.create({
    email,
    firstName,
    lastName,
    phone,
    location,
    role,
    password,
    passwordConfirm,
  });

  createSendToken(user, 201, res);
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Please fill all required fields!", 400));
  const user = await User.findOne({ email });
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Invalid Credentials!", 400));
  createSendToken(user, 200, res);
});

exports.getUserData = catchAsync(async (req, res, next) => {
  if (!req.cookies.jwt)
    return next(new AppError("Please log In to continue!", 400));
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) return next(new AppError("There is no such user!", 400));
  res.status(200).json({
    status: "success",
    user,
  });
});
