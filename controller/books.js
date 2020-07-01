const Book = require("../models/Book");
const Category = require("../models/category");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");

//// api/v1/books

exports.getBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  console.log(req.query);
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach(el => delete req.query[el]);
  const pagination = await paginate(page, limit, Book);
  //////

  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice"
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination
  });
});

/////
exports.getUserBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  console.log(req.query);
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach(el => delete req.query[el]);
  const pagination = await paginate(page, limit, Book);
  //////
  req.query.createUser = req.userId;
  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice"
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination
  });
});
/////

//// api/v1/categories/:Id/books
exports.getCategoryBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  console.log(req.query);
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach(el => delete req.query[el]);
  const pagination = await paginate(page, limit, Book);

  const books = await Book.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination
  });
});
exports.getBook = asyncHandler(async (req, res, next) => {
  // const book = await Book.find({ _id: req.params.id });
  const book = await Book.findById(req.params.id);
  if (!book) {
    throw new MyError(req.params.id + "ID-тай ном байхгүй байна.", 404);
  }
  res.status(200).json({
    success: true,

    data: book
  });
});
exports.createBook = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    throw new MyError(req.body.category + "ID тай категори байхгүй. ", 400);
  }
  req.body.createUser = req.userId;
  const book = await Book.create(req.body);
  res.status(200).json({
    success: true,
    data: book
  });
});
exports.deleteBook = asyncHandler(async (req, res, next) => {
  // const book = await Book.find({ _id: req.params.id });
  const book = await Book.findById(req.params.id);
  if (!book) {
    throw new MyError(req.params.id + "ID-тай ном байхгүй байна.", 404);
  }
  book.remove();
  res.status(200).json({
    success: true,
    data: book
  });
});
exports.updateBook = asyncHandler(async (req, res, next) => {
  req.body.updateUser = req.userId;
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!book) {
    throw new MyError(req.params.id + " ID-тай ном байхгүй байна", 400);
  }
  res.status(200).json({
    success: true,
    data: category
  });
});
///// image upload
////// PUT:  api/v1/books/:id/photo
exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    throw new MyError(req.params.id + " ID-тай ном байхгүй байна", 400);
  }
  const file = req.files.file;
  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    throw new MyError(
      "Таны зурагны хэмжээ их байна , таны зурагны хэмжээ 100К байх ёстой",
      400
    );
  }
  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зураг upload хийнэ үү", 400);
  }
  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;
  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, err => {
    if (err) {
      throw new MyError(
        "Зургийг хуулах явцад алдаа гарлаа. Алдаа : " + err.message,
        400
      );
    }
    book.photo = file.name;
    book.save();
    res.status(200).json({
      success: true,
      data: file.name
    });
  });

  console.log(req.files);
});
