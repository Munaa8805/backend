const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");
const { token } = require("morgan");
const BookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Номын нэрийг оруулна уу"],
      unique: true,
      trim: true,
      maxlength: [250, "Номын нэрийн хамгийн урт 250 тэмдэгт байна"]
    },
    photo: {
      type: String,
      default: "no-photo.jpg"
    },
    author: {
      type: String,
      required: [true, "Номын зохиогчийн нэрийг оруулна уу"],
      trim: true,
      maxlength: [50, "Номын зохиогчийн нэрийн хамгийн урт 50 тэмдэгт байна"]
    },

    rating: {
      type: Number,
      min: [1, "Рейтинг хамгийн багадаа 1 байх ёстой"],
      max: [10, "Рейтинг хамгийн ихдээ 10 байх ёстой"]
    },
    price: {
      type: Number,
      required: [true, "Номын үнийг оруулна уу"],
      min: [500, "Номын үнэ хамгийн багадаа 500 төг байх ёстой"]
    },
    balance: Number,
    averagePrice: Number,
    content: {
      type: String,
      required: [true, "Номын тайлбарыг дэлгэрэнгүй оруулна уу"],
      trim: true,
      maxlength: [
        1000,
        "Номын тайлбарыг дэлгэрэнгүй хамгийн урт 1000 тэмдэгт байна"
      ]
    },
    bestseller: {
      type: Boolean,
      default: false
    },
    available: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true
    },
    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    updateUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
BookSchema.statics.computeCategoryAveragePrice = async function(catID) {
  const obj = await this.aggregate([
    { $match: { category: catID } },
    { $group: { _id: "$category", avgPrice: { $avg: "$price" } } }
  ]);
  console.log(obj);
  await this.model("Category").findByIdAndUpdate(catID, {
    averagePrice: obj[0].avgPrice
  });
  return obj;
};
BookSchema.post("save", function() {
  this.constructor.computeCategoryAveragePrice(this.category);
});
BookSchema.post("remove", function() {
  this.constructor.computeCategoryAveragePrice(this.category);
});
BookSchema.virtual("zohiogch").get(function() {
  // return "Munaa";
  if (!this.author) return "";
  let tokens = this.author.split(" ");
  if (tokens.length === 1) tokens = this.author.split(".");
  if (tokens.length === 2) return tokens[1];
  return tokens[0];
});
module.exports = mongoose.model("Book", BookSchema);
