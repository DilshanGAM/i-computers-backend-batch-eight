import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/userRouter.js"
import jwt from "jsonwebtoken"
import productRouter from "./routes/productRouter.js"
import cors from "cors"
import dotenv from "dotenv"
import orderRouter from "./routes/orderRouter.js"

dotenv.config()


const mongoURI = process.env.MONGO_URL




mongoose.connect(mongoURI).then(
    ()=>{
        console.log("Connected to MongoDB Cluster")
    }
)


const app = express()

app.use(cors())


app.use(express.json())


app.use(
    (req,res,next)=>{

        const authorizationHeader = req.header("Authorization")

        if(authorizationHeader != null){

            const token = authorizationHeader.replace("Bearer ", "")

            jwt.verify(token, process.env.JWT_SECRET,
                (error, content)=>{

                    if(content == null){

                        res.status(401).json({
                            message : "invalid token"
                        })

                    }else{
                        
                        req.user = content

                        next()
                    }
                }
            )
        }else{
            next()
        }

    }
)



app.use("/api/users",userRouter)
app.use("/api/products",productRouter)
app.use("/api/orders",orderRouter)


app.listen(3000 , 
    ()=>{
        console.log("server is running")
    }
)