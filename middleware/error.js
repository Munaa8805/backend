const errorHandler = (error, req, res, next) => {
  console.log(error.stack.cyan.underline);
  const err = { ...error };

  if (err.name === "CastError") {
    err.message = "Энэ ID буруу бүтэцтэй ID байна";
    err.statusCode = 400;
  }
  if (err.code === 11000) {
    err.message = "Нэр талбарын утгийг давхардуулж өгч болохгүй";
    err.statusCode = 400;
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: err,
  });
};
module.exports = errorHandler;
