import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : true,
            unique : true
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        role:{
            type : String,
            default : "customer"
        },
        isBlocked : {
            type : Boolean,
            default : false
        },
        isEmailVerified:{
            type : Boolean,
            default : false
        },
        image : {
            type : String,
            required : true,
            default : "/default.jpg"
        }
    }
)

const User = mongoose.model("User", userSchema)

export default User;