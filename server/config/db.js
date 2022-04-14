const mongoose = require("mongoose");

const URL = process.env.URL;

const connectDB = async () => {
	const client = await mongoose.connect(URL, {
		useNewUrlParser: true,
	});

	console.log(`MongoDB connection succesful to host ${client.connection.host}`);
};

module.exports = connectDB;
