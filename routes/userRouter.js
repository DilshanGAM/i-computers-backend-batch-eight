import express from "express"
import { createUser, getUser, googleLogin, loginUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)
userRouter.get("/", getUser)
userRouter.post("/google-login", googleLogin)


export default userRouter