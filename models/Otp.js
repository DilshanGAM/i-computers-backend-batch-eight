import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
	otp: {
		type: String,
		required: true,
    }
});

const Otp = mongoose.model("Otp", otpSchema);
export default Otp;
