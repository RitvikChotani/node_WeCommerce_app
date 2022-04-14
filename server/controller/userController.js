const User = require("../model/usersModel");
const Product = require("../model/productsModel");
const setToken = require("../utils/jwtCookie");
const sendEmail = require("../utils/sendEmail");
const error = require("../utils/error");
const crypto = require("crypto");

//Register our user
const registerUser = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		const newUser = new User({
			name,
			email,
			password,
			avatar: {
				public_id: "sample_id",
				url: "sample_url",
			},
		});

		await newUser.save();

		setToken(newUser, "200", res);
	} catch (err) {
		error(err, res, 409);
	}
};

const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email && !password) {
			throw new Error("Please enter email and password");
		}

		const user = await User.findOne({ email }).select("+password");
		if (!user) {
			throw new Error("Invalid email or password");
		}
		const isPasswordMatch = await user.comparePassword(password);

		if (!isPasswordMatch) {
			throw new Error("Invalid email or password");
		}

		setToken(user, "200", res);
	} catch (err) {
		error(err, res, 409);
	}
};

const logoutUser = async (req, res) => {
	try {
		res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

const forgotPassword = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			res.status(409).json({ message: "User not found" });
		}

		const resetToken = user.getResetPasswordToken();

		try {
			await user.save({ validateBeforeSave: true });

			const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

			const message = `Your password reset token is :- \n\n ${resetPasswordURL}`;

			await sendEmail({
				email: user.email,
				subject: `WEcommerce password reset`,
				message,
			});

			res.status(200).json({ message: "Email sent to user successfully" });
		} catch (err) {
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;

			error(err, res, 409);
		}
	} catch (err) {
		error(err, res, 409);
	}
};

const resetPassword = async (req, res) => {
	try {
		const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

		const user = await User.findOne({ resetPasswordToken: resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
		console.log(user);

		if (!user) {
			res.status(200).json({ message: "User not found" });
		} else if (req.body.password !== req.body.confirmPassword) {
			res.status(401).send({ message: "Password and confirm password do not match" });
		}

		user.password = req.body.password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save();

		setToken(user, 200, res);
	} catch (err) {
		error(err, res, 409);
	}
};

const getUserDetails = async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		res.status(200).json({ success: true, user });
	} catch (err) {
		error(err, res, 409);
	}
};

const updatePassword = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("+password");
		const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

		if (!isPasswordMatch) {
			throw new Error("Old Password is Incorrect");
		}

		if (req.body.newPassword === undefined && req.body.confirmPassword === "" && req.body.newPassword !== req.body.confirmPassword) {
			throw new Error("Password do not match");
		}
		console.log(user.password);
		user.password = req.body.newPassword;
		await user.save();

		setToken(user, "200", res);
	} catch (err) {
		error(err, res, 409);
	}
};

const updateUserProfile = async (req, res) => {
	try {
		const newUser = {
			name: req.body.name,
			email: req.body.email,
		};

		const user = await User.findByIdAndUpdate(req.user.id, newUser, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({ success: true, user });
	} catch (err) {
		error(err, res, 409);
	}
};

const getAllUsers = async (req, res) => {
	try {
		const user = await User.find();
		res.status(200).json({ success: true, user });
	} catch (err) {
		error(err, res, 409);
	}
};

const getOneUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new Error("User not found");
		}
		res.status(200).json({ success: true, user });
	} catch (err) {
		error(err, res, 409);
	}
};

const updateUserDetailsAndRoles = async (req, res) => {
	try {
		const newUser = {
			name: req.body.name,
			email: req.body.email,
			role: req.body.role,
		};

		const user = await User.findByIdAndUpdate(req.params.id, newUser, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({ success: true, user });
	} catch (err) {
		error(err, res, 409);
	}
};

const deleteUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			throw new Error("User does not exists");
		}
		res.status(200).json({ success: true, message: "User Deleted Successfully" });

		await user.remove();
	} catch (err) {
		error(err, res, 409);
	}
};

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	forgotPassword,
	resetPassword,
	getUserDetails,
	updatePassword,
	updateUserProfile,
	getAllUsers,
	getOneUser,
	updateUserDetailsAndRoles,
	deleteUser,
};

//
const codeCopy = async (req, res) => {
	try {
	} catch (err) {
		error(err, res, 409);
	}
};
