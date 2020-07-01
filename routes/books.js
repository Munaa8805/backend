const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");
const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
  uploadBookPhoto
} = require("../controller/books");
//// api/v1/books
router
  .route("/")
  .get(getBooks)
  .post(protect, authorize("admin", "operator"), createBook);
//// api/v1/book
router
  .route("/:id")
  .get(getBook)
  .delete(protect, authorize("admin"), deleteBook)
  .put(protect, authorize("admin", "operator"), updateBook);
////
router
  .route("/:id/photo")
  .put(protect, authorize("admin", "operator"), uploadBookPhoto);
module.exports = router;
