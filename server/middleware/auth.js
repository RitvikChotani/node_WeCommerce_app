const User = require("../model/usersModel");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return res.status(403).json({ message: "Please login to see this resources" });
	}

	const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
	req.user = await User.findById(decodedToken.id);

	next();
};

const authRoles = (roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(409).json({ success: false, message: `${req.user.role} cannot use this resource` });
		}

		next();
	};
};

module.exports = { isAuthenticated, authRoles };
