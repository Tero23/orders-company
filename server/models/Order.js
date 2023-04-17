const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  storeLocation: {
    type: String,
    required: [true, "Please specify the store location!"],
    enum: {
      values: [
        "Beverly Wilshire",
        "Las Vegas",
        "Miami",
        "Charlotte",
        "Private Showroom (HQ)",
      ],
      message: "Invalid Location!",
    },
  },

  clientName: {
    type: String,
  },

  dueDate: {
    type: Date,
    required: [true, "Please specify the Due Date!"],
    min: [new Date(Date.now()), "Due Date must be in the future!"],
  },

  image: {
    type: String,
    required: [true, "Please upload the image!"],
  },

  imageUrl: {
    type: String,
  },

  designer: {
    type: String,
    required: [true, "Please specify the designer!"],
    enum: {
      values: ["Jason", "Jed", "Jeremy", "Zach"],
      message: "There is no such designer!",
    },
  },

  productType: {
    type: String,
    required: [true, "Please specify the product type!"],
    enum: {
      values: [
        "Ring",
        "Pendant",
        "Necklace",
        "Bracelet",
        "Earrings",
        "Chain",
        "Other",
      ],
      message: "Invalid product type!",
    },
  },

  ringSize: {
    type: String,
    required: function () {
      return this.productType === "Ring";
    },
    enum: {
      values: [
        "3",
        "3.25",
        "3.5",
        "3.75",
        "4",
        "4.25",
        "4.5",
        "4.75",
        "5",
        "5.25",
        "5.5",
        "5.75",
        "6",
        "6.25",
        "6.5",
        "6.75",
        "7",
        "7.25",
        "7.5",
        "7.75",
        "8",
        "8.25",
        "8.5",
        "8.75",
        "9",
      ],
      message: "Invalid ring size!",
    },
  },

  necklaceLength: {
    type: Number,
    required: function () {
      return this.productType === "Necklace";
    },
  },

  braceletLength: {
    type: Number,
    required: function () {
      return this.productType === "Bracelet";
    },
  },

  chainType: {
    type: String,
  },

  material: {
    type: String,
    required: [true, "Please specify the material!"],
    enum: {
      values: [
        "10kt Gold",
        "14kt Gold",
        "18kt Gold",
        "22kt Gold",
        "24kt Gold",
        "Platinum",
        "Silver",
        "Other",
      ],
      message: "Invalid material!",
    },
  },

  goldColor: {
    type: String,
    enum: {
      values: ["Yellow", "White", "Rose", "Black", "Two Tone", "Tritone"],
      message: "Invalid gold color!",
    },
    required: function () {
      return this.material.split(" ")[1] === "Gold";
    },
  },

  serialNumber: {
    type: Number,
  },

  salePrice: {
    type: Number,
    required: [true, "Please specify the Sale Price!"],
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "An order must have an owner!"],
    ref: "User",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
