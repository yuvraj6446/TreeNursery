const mongoose = require("mongoose");

// Define the Tags schema
const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: { type: String },
	products: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
	],
});

// Export the Tags model
module.exports = mongoose.model("Category", categorySchema);
