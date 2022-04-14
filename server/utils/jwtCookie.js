const setToken = (user, code, res) => {
	const token = user.getJWToken();

	//Options for cookie
	const options = {
		expires: new Date(Date.now + process.env.COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
		httpOnly: true,
	};

	res.status(code).cookie("token", token, options).send({
		success: true,
		user,
		token,
	});
};

module.exports = setToken;
