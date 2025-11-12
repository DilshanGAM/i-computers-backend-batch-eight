import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createUser(req, res) {
	const data = req.body;

	const hashedPassword = bcrypt.hashSync(data.password, 10);

	const user = new User({
		email: data.email,
		firstName: data.firstName,
		lastName: data.lastName,
		password: hashedPassword,
		role: data.role,
	});

	user.save().then(() => {
		res.json({
			message: "User created successfully",
		});
	});
}

export function loginUser(req, res) {
	const email = req.body.email;
	const password = req.body.password;
	console.log("Login attempt for email: " + email);
	User.find({ email: email }).then((users) => {
		if (users[0] == null) {
			res.status(404).json({
				message: "User not found",
			});
		} else {
			const user = users[0];
			console.log(user)

			const isPasswordCorrect = bcrypt.compareSync(password, user.password);

			if (isPasswordCorrect) {
				const payload = {
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
					isEmailVerified: user.isEmailVerified,
					image: user.image,
				};

				const token = jwt.sign(payload, process.env.JWT_SECRET, {
					expiresIn: "150h",
				});

				res.json({
					message: "Login successful",
					token: token,
					role: user.role,
				});
			} else {
				res.status(401).json({
					message: "Invalid password",
				});
			}
		}
	});
}

export function isAdmin(req) {
	if (req.user == null) {
		return false;
	}
	if (req.user.role != "admin") {
		return false;
	}

	return true;
}
//add try catch for async-await
