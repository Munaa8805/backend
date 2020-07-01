const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/////
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Хэрэглэгчийн нэрийг оруулна уу"]
  },
  email: {
    type: String,
    required: [true, "Хэрэглэгчийн е-майл хаягийг оруулна уу"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Таны е-майл хаяг буруу байна"
    ]
  },
  role: {
    type: String,
    required: [true, "Хэрэгчлэгчийн эрхийг оруулна уу"],
    enum: ["user", "operator", "admin"],
    default: "user"
  },
  password: {
    type: String,
    minLength: 4,
    required: [true, "Та нууц үгээ оруулна уу"],
    select: false
  },
  resetPasswordToken: String,
  resetPasswordTokenExp: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
UserSchema.pre("save", async function(next) {
  //// Nuuts ug oorchlogdoogui bol daraachiin middlewhere luu shiljine
  if (!this.isModified("password")) next();
  ////// Nuuts ug oorchloh
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.getJsonWebToken = function() {
  const token = jwt.sign(
    {
      id: this._id,
      role: this.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN
    }
  );
  return token;
};
UserSchema.methods.checkPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
UserSchema.methods.generatePasswordChangeToken = function() {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.esetPasswordTokenExp = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
