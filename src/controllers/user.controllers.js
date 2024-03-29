import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/users.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req,res)=>{

   //get user details
   //validate user details(not empty)
   //check if user already exist
   //check for files
   //upload them on cloudinary
   //create user
   //remove password and refresh token
   //check creation 
   //send response
   const {username,fullName,email,password,faceData}=req.body;

   if([username,fullName,email,password,faceData].some((field)=>field?.trim()===""))
   {
    throw new ApiError(401,"some fields are empty")
   }
   const existedUser=await User.findOne({
    $or:[{username},{email}]
   })
   if(existedUser)
   {
    throw new ApiError(400,"User already exists")
   }
   const image1Url=req.files?.userImage1?.[0]?.path
   const image2Url=req.files?.userImage2?.[0]?.path
   const image3Url=req.files?.userImage3?.[0]?.path
   if(!image1Url || !image2Url || !image3Url)
   {
    throw new ApiError(403,"All images are required")
   }
   const userImage1=await uploadOnCloudinary(image1Url)
   const userImage2=await uploadOnCloudinary(image2Url)
   const userImage3=await uploadOnCloudinary(image3Url)
   if(!userImage1 || !userImage2 || !userImage3)
   {
    throw new ApiError(403,"All images are required")
   }
   const user= await User.create({
    fullName,
    username:username.toLowerCase(),
    userImage1:userImage1.url,
    userImage2:userImage2.url,
    userImage3:userImage3.url,
    password,
    email,
    faceData,
   })
   const createdUser= await User.findById(user._id).select("-password -refreshToken")
   if(!createdUser)
   {
    throw new ApiError(500,"something went wrong while registering the user")
   }
   return res.status(200).json(
    new ApiResponse(201,createdUser,"User registered successfully!!")
   )
  
   })


const loginUser=asyncHandler(async (req,res)=>{

  
})

export {
  registerUser,
  loginUser,
}