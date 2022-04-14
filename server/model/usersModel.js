const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter the name"],
		maxLength: [30, "Max length cannot exceed 30 characters"],
		minLength: [4, "Max length cannot exceed 4 characters"],
	},
	email: {
		type: String,
		required: [true, "Please enter the email"],
		unique: true,
		validate: [validator.isEmail, "Please enter a valid email"],
	},
	password: {
		type: String,
		required: [true, "Please enter the password"],
		minLength: [8, "Please enter a valid password of min 8"],
		select: false,
	},
	avtar: {
		public_id: {
			type: String,
		},
		url: {
			type: String,
		},
	},
	role: {
		type: String,
		default: "User",
	},
	resetPasswordToken: {
		type: String,
	},
	resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.getJWToken = function () {
	return jwt.sign(
		{
			id: this._id,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRATION,
		},
	);
};

userSchema.methods.comparePassword = async function (givenPassword) {
	return await bcrypt.compare(givenPassword, this.password);
};

//Reset password token
userSchema.methods.getResetPasswordToken = function () {
	//Generate new password token
	const resetToken = crypto.randomBytes(20).toString("hex");

	//Hashing and adding to user schema
	this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
	console.log(resetToken);
	this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

	return resetToken;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
