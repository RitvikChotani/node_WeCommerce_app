const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter Product name"],
		trim: true,
	},
	description: {
		type: String,
		require: [true, "Please enter Product description"],
	},
	price: {
		type: Number,
		required: [true, "Please enter the price of the product"],
		maxlength: [8, "Price cannot exceed 8 figures"],
	},
	avgRating: {
		type: Number,
		default: 0,
	},
	images: [
		{
			public_id: {
				type: String,
				required: true,
			},
			url: {
				type: String,
				required: true,
			},
		},
	],
	category: {
		type: String,
		required: [true, "Please enter product category"],
	},
	stock: {
		type: Number,
		required: [true, "Please enter product stock"],
		maxlength: [4, "Stock cannot exceed 4 figures"],
		default: 1,
	},
	numberOfReviews: {
		type: Number,
		default: 0,
	},
	reviews: [
		{
			user: {
				type: mongoose.Schema.ObjectId,
				ref: "User",
				required: true,
			},
			name: {
				type: String,
				required: true,
			},
			rating: {
				type: Number,
				required: true,
			},
			comment: {
				type: String,
				required: true,
			},
		},
	],
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
