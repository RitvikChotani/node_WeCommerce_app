const Product = require("../model/productsModel");

//Create product route --- ADMIN ONLY
const createProduct = async (req, res) => {
	req.body.user = req.user.id;
	const newProduct = new Product(req.body);
	try {
		await newProduct.save();
		res.status(201).json({
			success: true,
			newProduct,
		});
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

const updateProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body);
		res.status(200).json({ success: true, product });
	} catch (err) {
		res.status(409).json({ success: false, message: err.message });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			await product.deleteOne();
			res.status(200).json({ success: true, message: "Product deleted successfully." });
		} else {
			res.status(409).json({ success: false, message: "Product not found." });
		}
	} catch (err) {
		res.status(409).json({ success: false, message: err.message });
	}
};

const getSpecificProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			res.status(200).send({ success: true, product });
		} else {
			res.status(404).send({ success: false, message: "Product not found." });
		}
	} catch (err) {
		res.status(500).send({ success: true, message: err.message });
	}
};

//Get All and also Search product route --- Open to all (For search query is must)
const getAllProducts = async (req, res) => {
	const resultPerPage = 2;
	const productCount = await Product.countDocuments();

	try {
		let searchQuery = {};
		let allProduct;
		if (req.query === undefined) {
			allProduct = await Product.find(searchQuery);
		}
		if (req.query.keyword) {
			searchQuery.name = { $regex: req.query.keyword, $options: "i" };
		}
		if (req.query.category) {
			searchQuery.category = req.query.category;
		}
		if (req.query.price) {
			price = JSON.stringify(req.query.price).replace(/\b(gte|lte)\b/g, (key) => `$${key}`);
			searchQuery.price = JSON.parse(price);
			console.log(searchQuery);
		}
		const page = req.query.page || 1;
		const skip = resultPerPage * (page - 1);

		allProduct = await Product.find(searchQuery).limit(resultPerPage).skip(skip);

		res.status(200).json({
			success: true,
			pageNumber: page,
			productCount,
			result: allProduct.length,
			allProduct,
		});
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

//Create new review or update the review

const createProductReview = async (req, res) => {
	try {
		const review = {
			user: req.user._id,
			name: req.user.name,
			rating: Number(req.body.rating),
			comment: req.body.comment,
		};

		const product = await Product.findById(req.params.id);
		console.log(product.reviews);
		const isReviewed = product.reviews.find((reviews) => {
			return reviews.user.toString() === review.user.toString();
		});
		if (isReviewed) {
			product.reviews.forEach((reviews) => {
				if (reviews.user.toString() === review.user.toString()) {
					reviews.rating = review.rating;
					reviews.comment = review.comment;
				}
			});
		} else {
			product.reviews.push(review);
		}

		product.numOfReviews = product.reviews.length;
		let avg = 0;
		product.reviews.forEach((review) => {
			avg += review.rating;
		});
		product.avgRating = avg / product.reviews.length;

		await product.save();

		res.status(200).json({ success: true });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

const getAllReview = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			throw new Error("Product not found");
		}

		res.status(200).json({ success: true, reviews: product.reviews });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

const deleteReview = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) {
			throw new Error("Product not found");
		}

		const reviewId = req.query.id;

		const reviews = product.reviews.filter((rev) => rev._id.toString() !== reviewId.toString());

		product.reviews = reviews;
		product.numOfReviews = reviews.length;
		let avg = 0;
		reviews.forEach((review) => {
			avg += review.rating;
		});
		if (reviews.length === 0) {
			product.avgRating = 0;
		} else {
			product.avgRating = avg / reviews.length;
		}

		await product.save();

		res.status(200).json({ success: true });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

module.exports = {
	getAllProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getSpecificProduct,
	createProductReview,
	getAllReview,
	deleteReview,
};
