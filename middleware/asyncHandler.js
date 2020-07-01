const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;

// catch (error) {
//     // res.status(400).json({
//     //   success: false,
//     //   error: error,
//     // });
//     next(error);
//   }
