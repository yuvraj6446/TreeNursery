const mongoose = require("mongoose")

// Define the Courses schema
const productSchema = new mongoose.Schema({
  ProductName: { type: String },
  ProductDescription: { type: String },
  
  Description: {
    type: String,
  },
 
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
  ],
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Category",
  },
  
  instructions: {
    type: [String],
  },
 
  createdAt: { type: Date, default: Date.now },
})

// Export the Courses model
module.exports = mongoose.model("Product", productSchema)
