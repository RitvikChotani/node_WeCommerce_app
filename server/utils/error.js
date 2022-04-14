const error = (err, res, status) => {
	if (err.code === 11000) {
		res.status(status).json({ message: `Duplicate ${Object.keys(err.keyValue)}` });
	} else if (err.name === "JsonWebTokenError") {
		res.status(status).json({ message: `JSON Web token is Invalid` });
	} else if (err.name === "TokenExpiredError") {
		res.status(status).json({ message: `JSON Web token expired, please login again` });
	} else {
		res.status(status).json({ message: err.stack });
	}
};

module.exports = error;
