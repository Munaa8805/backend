const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const colors = require("colors");
const morgan = require("morgan");
const path = require("path");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
const logger = require("./middleware/logger");
const cors = require("cors");
const fileUpload = require("express-fileupload");
///// application-ii tohirgoonii file
dotenv.config({ path: "./config/config.env" });
////create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a"
});
/////
const app = express();
connectDB();
////
app.use(cors());
//// body parser
app.use(express.json());
app.use(fileUpload());
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
//// use function ашиглаад холбож байна. категорийн Route-iig
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use(errorHandler);

////
const server = app.listen(
  process.env.PORT,
  console.log(`hello express server ${process.env.PORT} дээр ажиллалаа`)
);
process.on("unhandledRejection", (err, promise) => {
  console.log(`Aлдаа гарсан : ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
