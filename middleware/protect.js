const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const MyError = require("../utils/myError");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new MyError(
      "Энэ үйлдэлийг хийхэд таний эрх хүрэхгүй байна. Та эхлээд логин хийнэ үү",
      401
    );
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    throw new MyError(
      "Энэ үйлдэлийг хийхэд таний эрх хүрэхгүй байна. Та эхлээд логин хийнэ үү. Token байхгүй байна.",
      401
    );
  }
  ///// verify hiigeed hereglegchiin ID gargaj abch bn
  const objectToken = jwt.verify(token, process.env.JWT_SECRET);

  req.userId = objectToken.id;
  req.userRole = objectToken.role;
  next();
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      throw new MyError(
        "Таны эрх [" + req.userRole + "] энэ үйлдлийг гүйцэтгэхэд хүрэлцэхгүй!",
        403
      );
    }
    next();
  };
};
