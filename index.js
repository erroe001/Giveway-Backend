import express from 'express'
import mongoose, { Schema, model } from 'mongoose'
import { ApiErrorResponse, ApiResponse, globleErrorHandler } from './Responses.js'
import { rateLimit } from 'express-rate-limit'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config({
  path:".env"
})
const App = express()
const limiter = rateLimit({
	windowMs: 60 * 24 * 60 * 1000, // 24 hours
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

// Apply the rate limiting middleware to all requests.
App.use(limiter)

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
  origin:"https://www.myclassestripura.com/"
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
    enum:["AGARTALA" , "OUTSIDE AGARTALA"],
    default:"AGARTALA"
    },
    Class:{
    type:String,
    required:true,
    default:"1"
  },
  board:{
    type:String,
    default:"TBSE"
  },
  promoter:{
      type:String,
      default:"NO"
    },
    referalCode:{
    type:String,
    default:"8837432226"
  },
  streem:{
    type:String,
    default:"ARTS"
  }
})

const UserForm = model("Userform" , FormUser)
App.get("/" , (req,res)=>{
  new ApiResponse(200 , "Success").response(res)
})



App.post("/api/v1/SignupUser" , async(req,res , next)=>{
  try {
    let {email , name , phone, school , address  , Class , board , referalCode , promoter , streem } = req.body
  //  const isReferalFound =  await UserForm.findOne({phone:referalCode})
  //  if(!isReferalFound){
  //   throw new ApiErrorResponse(404 , "Referal code invalid")
  //  }
  try {
     const newUser = await UserForm.create({
      email , 
      name , 
      phone, 
      school , 
      address , 
      Class , 
      board ,
      referalCode,
      promoter,
      streem
      })
      await newUser.save()
      new ApiResponse(200 , "Success" , newUser).response(res)
  } catch (error) {
    if(error.code){
      if(error.keyValue.email){
        throw new ApiErrorResponse(400 , "Email already exist ")
      }
      throw new ApiErrorResponse(400 , "Phone already exist")
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