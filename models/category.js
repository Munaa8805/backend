const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Та категорын нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxlength: [50, "Категорын нэрийн хамгийн урт 50 тэмдэгт байна"]
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Та категорын тайлбарыг заавал оруулах ёстой"],
      maxlength: [500, "Категорын тайлбарын хамгийн урт 500 тэмдэгт байна"]
    },
    photo: {
      type: String,
      default: "no-photo.jpg"
    },
    averageRating: {
      type: Number,
      min: [1, "Рейтинг хамгийн багадаа 1 байх ёстой"],
      max: [10, "Рейтинг хамгийн ихдээ 10 байх ёстой"]
    },
    averagePrice: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
CategorySchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "category",
  justOne: false
});
CategorySchema.pre("remove", async function(next) {
  //// нэрийг устгах
  await this.model("Book").deleteMany({
    category: this._id
  });
  next();
});
CategorySchema.pre("save", function(next) {
  //// нэрийг хөрвүүлэх
  this.slug = slugify(this.name);
  this.averageRating = Math.floor(Math.random() * 10) + 1;
  // this.averagePrice = Math.floor(Math.random() * 10000) + 3000;
  next();
});
module.exports = mongoose.model("Category", CategorySchema);
