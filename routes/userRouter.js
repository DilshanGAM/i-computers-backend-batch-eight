import express from "express"
import { createUser, getAllUsers, getUser, googleLogin, loginUser, sendOTP, updateUserStatus, validateOTPAndUpdatePassword } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)
userRouter.get("/", getUser)
userRouter.post("/google-login", googleLogin)
userRouter.get("/send-otp/:email", sendOTP)
userRouter.post("/validate-otp", validateOTPAndUpdatePassword)
userRouter.get("/all", getAllUsers)
userRouter.put("/toggle-block/:email", updateUserStatus)


export default userRouter