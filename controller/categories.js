const Category = require("../models/category");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate");
// const asyncHandler = require("../middleware/asyncHandler");
const asyncHandler = require("express-async-handler");
////
exports.getCategories = asyncHandler(async (req, res, next) => {
  //// page
  const page = parseInt(req.query.page) || 1;
  // delete req.query.page;
  ///// limit
  const limit = parseInt(req.query.limit) || 100;
  // delete req.query.limit;
  ///// sort
  const sort = req.query.sort;
  // delete req.query.sort;
  //// select
  console.log(req.query);
  const select = req.query.select;
  // delete req.query.select;
  ["select", "sort", "page", "limit"].forEach(el => delete req.query[el]);
  //// pagination
  const pagination = await paginate(page, limit, Category);
  /////
  const categories = await Category.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    data: categories,
    pagination
  });
});
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate("books");
  if (!category) {
    // return res.status(400).json({
    //   success: false,
    //   error: req.params.id + " ID-тай мэдээлэл байхгүй байна",
    // });
    throw new MyError(req.params.id + " ID-тай мэдээлэл байхгүй.", 400);
  }
  res.status(200).json({
    success: true,
    data: category
  });
  // } catch (error) {
  //   // res.status(400).json({
  //   //   success: false,
  //   //   error: error,
  //   // });
  //   next(error);
  // }
});
exports.createCategory = asyncHandler(async (req, res, next) => {
  //   console.log("data:", req.body);
  // try {
  const category = await Category.create(req.body);
  res.status(200).json({
    success: true,
    data: category
  });
  // } catch (error) {
  //   // res.status(400).json({
  //   //   success: false,
  //   //   error: error,
  //   // });
  //   next(error);
  // }
});
exports.updateCategory = asyncHandler(async (req, res, next) => {
  // try {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!category) {
    throw new MyError(req.params.id + " ID-тай мэдээлэл байхгүй байна", 400);
    // return res.status(400).json({
    //   success: false,
    //   error: req.params.id + " ID-тай мэдээлэл байхгүй байна",
    // });
  }
  res.status(200).json({
    success: true,
    data: category
  });
  // } catch (error) {
  //   // res.status(400).json({
  //   //   success: false,
  //   //   error: error,
  //   // });
  //   next(error);
  // }
});
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  // try {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new MyError(req.params.id + " ID-тай мэдээлэл байхгүй байна", 400);
    // return res.status(400).json({
    //   success: false,
    //   error: req.params.id + " ID-тай мэдээлэл байхгүй байна",
    // });
  }
  category.remove();
  res.status(200).json({
    success: true,
    data: category
  });
  // } catch (error) {
  //   // res.status(400).json({
  //   //   success: false,
  //   //   error: error,
  //   // });
  //   next(error);
  // }
});
