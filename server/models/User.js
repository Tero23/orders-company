const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: [true, "Please provide an email!"],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },

  firstName: {
    type: String,
    required: [true, "Please enter your first name!"],
    trim: true,
  },

  lastName: {
    type: String,
    required: [true, "Please enter your last name!"],
    trim: true,
  },

  phone: {
    type: String,
    required: [true, "Please enter your phone number!"],
  },

  location: {
    type: String,
    required: [true, "Please specify your location!"],
    enum: {
      values: ["A", "B", "C"],
      message: "Location is either A, B or C!",
    },
  },

  role: {
    type: String,
    enum: {
      values: ["User", "Administrator", "Salesman", "Designer"],
      message: "That is not an option!",
    },
    default: "User",
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    minlength: [8, "Password must be at least 8 characters long!"],
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password!"],
    validate: {
      // This only works on create() and save()
      validator: function (value) {
        return value === this.password;
      },
      message: "Incorrect password confirmation!",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
  }
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
