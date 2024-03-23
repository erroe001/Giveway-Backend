import express from 'express'
import mongoose, { Schema, model } from 'mongoose'
import { ApiErrorResponse, ApiResponse, globleErrorHandler } from './Responses.js'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config({
  path:".env"
})
const App = express()

App.use(express.json())
App.use(express.static("Public"))
App.use(express.urlencoded({extended:false}))
App.listen(process.env.PORT , async()=>{
  try {
    await mongoose.connect(process.env.MONGOOSE_URL)
    console.log("Mongoose Connected")
    console.log("Server Started")
  } catch (error) {
    console.log("Failed To Connect Mongoose ")
    
  }
})
App.use(cors({
  origin:"*"
}))




const FormUser = new Schema({
  email:{
    type:String,
    index:true , 
    unique:true    
  },
  phone:{
    type:String,
    index:true , 
    unique:true    
  },
  name:{
    type:String,
  },
  school:{
    type:String,
    required:true

  },
  address:{
    type:String,
    enum:["Agartala" , "Outside Agartala"],
    default:"Agartala"
    },
    Class:{
    type:String,
    required:true,
    default:"1"
  },
  Board:{
    type:String,
    default:"TBSE"
  },
  aim:{
    type:String,
    required:true
  },
  referalCode:{
    type:String,
    default:""
  },


})

const UserForm = model("Userform" , FormUser)
App.get("/" , (req,res)=>{
  new ApiResponse(200 , "Success").response(res)
})



App.post("/api/v1/SignupUser" , async(req,res , next)=>{
  try {
    let {email , name , phone   , school , address  , Class , Board , referalCode , aim } = req.body
    console.log(req.body)
  try {
      
     const newUser = await UserForm.create({
      email , 
      name , 
      phone, 
      school , 
      address , 
      Class , 
      aim , 
      Board ,
      referalCode
      })
      await newUser.save()
      new ApiResponse(200 , "Success" , newUser).response(res)
  } catch (error) {
    if(error.code){
      throw new ApiErrorResponse(400 , "User Already exist")
    }
    throw new ApiErrorResponse(400 , "Something went wrong")

  }
  } catch (error) {
    next(error)
  }
})


App.get("/api/v1/getInfo" , async(req,res,next)=>{
  // get all the filtered details based on the details 

})



App.use(globleErrorHandler)