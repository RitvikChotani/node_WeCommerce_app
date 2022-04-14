const Order = require("../model/orderModel");
const Product = require("../model/productsModel");
const error = require("../utils/error");

const createNewOrder = async (req, res) => {
	try {
		const order = new Order({
			...req.body,
			user: req.user._id,
		});
		await order.save();
		res.status(200).send({ success: true, order });
	} catch (err) {
		error(err, res, 500);
	}
};

//Get order details
const getOrderDetails = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate("user", "name email");

		if (!order) {
			throw new Error("Order not found");
		}

		res.status(200).send({ success: true, order });
	} catch (err) {
		error(err, res, 400);
	}
};

//Get users orders
const getUserOrderDetails = async (req, res) => {
	try {
		console.log(req.user);
		const order = await Order.find({ user: req.user._id });
		if (!order) {
			throw new Error("Order not found");
		}
		res.status(200).send({ success: true, order });
	} catch (err) {
		error(err, res, 400);
	}
};

//Get all orders ADMIN
const getAllOrders = async (req, res) => {
	try {
		const order = await Order.find();
		let amount = 0;
		if (!order) {
			throw new Error("Order not found");
		}
		order.forEach((order) => {
			amount += order.totalPrice;
		});
		res.status(200).send({ success: true, order, amount });
	} catch (err) {
		error(err, res, 400);
	}
};

//Update order ADMIN
const updateOrder = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		if (!order) {
			throw new Error("Order not found");
		}
		if (order.orderStatus === "Delivered") {
			return res.status(200).send({ message: "Order already delivered" });
		}
		order.orderItems.forEach(async (order) => {
			await updateStock(order.product, order.quantity);
		});
		order.orderStatus = req.body.status;
		if (req.body.status === "Delivered") {
			order.deliveredAt = Date.now();
		}

		order.save();

		res.status(200).send({ success: true });
	} catch (err) {
		error(err, res, 400);
	}
};

//Delet order ADMIN
const deleteOrder = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);

		if (!order) {
			throw new Error("Order not found");
		}
		await order.remove();
		res.status(200).send({ success: true });
	} catch (err) {
		error(err, res, 400);
	}
};

const copyPaste = async (req, res) => {
	try {
	} catch (err) {}
};

module.exports = {
	createNewOrder,
	getOrderDetails,
	getUserOrderDetails,
	getAllOrders,
	updateOrder,
	deleteOrder,
};

async function updateStock(id, quantity) {
	const product = await Product.findById(id);
	product.stock -= quantity;

	await product.save();
}
