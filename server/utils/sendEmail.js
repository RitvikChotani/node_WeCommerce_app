const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
	const transporter = nodeMailer.createTransport({
		service: process.env.SMTP_SERVICE,
		host: "smtp.yahoo.com",
		port: 465,
		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	const mailOptions = {
		from: process.env.SMTP_EMAIL,
		to: options.email,
		subject: options.subject,
		text: options.message,
	};

	await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
