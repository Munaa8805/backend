const express = require("express");
const { protect, authorize } = require("../middleware/protect");
const {
  register,
  login,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword
} = require("../controller/users");
const { getUserBooks } = require("../controller/books");
const router = express.Router();
//// api/v1/user
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
//// api/v1/user
router
  .route("/")
  .get(authorize("admin"), getUsers)
  .post(authorize("admin"), createUser);
router
  .route("/:id")
  .get(authorize("admin", "operator"), getUser)
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);
router
  .route("/:id/books")
  .get(protect, authorize("admin", "operator"), getUserBooks);
module.exports = router;
