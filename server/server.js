//Uncaught Error Handling
process.on("uncaughtException", (err) => {
	console.log(`Encountered an UncaughtException error when trying to connect, ${err.stack}`);
	console.log(`Shutting down the server`);
	process.exit(1);
});

//Server setup
const app = require("./app");
require("dotenv").config();
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
	connectDB();
	console.log(`Server is up and running on http://localhost:${PORT}`);
});

//Unhandled promises
process.on("unhandledRejection", (err) => {
	console.log(`Encountered an Unhandled error when trying to connect, ${err.stack}`);
	console.log(`Shutting down the server`);
	server.close(() => process.exit(1));
});
