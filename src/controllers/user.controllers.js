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
const generateRefreshAndAccessToken= async (userId)=>{
    try {
      const user=await User.findById(userId)
      const refreshToken=user.generateRefreshTokens()
      const accessToken=user.generateAccessTokens()
       user.refreshToken=refreshToken
       user.save({validateBeforeSave:false})
       return {refreshToken,accessToken}
    } catch (error) {
      throw new ApiError(500,"something went wrong while generating refresh and access token")
    }
   }

const loginUser=asyncHandler(async (req,res)=>{
  //get the data from req
  //validate username or email and facedata
  // find user
  // validate password
  // generate refresh and access token
  // send cookie
  


const {username,password,email}=req.body
if(!(username||email))
{
  throw new ApiError(402,"Username or Email is Required!")
}
const user=await User.findOne({
  $or:[{username},{email}]
})
if(!user)
{
  throw new ApiError(400,"User does not exist!")
}
const isPasswordValid=user.isPasswordCorrect(password)
if(!isPasswordValid)
{
  throw new ApiError(403,"Incorrect Password")
}
const {refreshToken,accessToken}=await generateRefreshAndAccessToken(user._id)
const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
const options={
  httpOnly:true,
  secure:true,
}
return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
  new ApiResponse(
    200,
    {
      user:loggedInUser,
      accessToken,
      refreshToken
    },
  " User password is correct and refresh and access token have been generated!"
  )
)
})
const logoutUser=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
   )
   const options={
    httpOnly:true,
    secure:true,
  }
  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(
      200,
      {},
      "User Logged out succesfully"
    )
  )
})
const refreshTokenGenerator=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies?.refreshToken || req.body
  if(!incomingRefreshToken)
  {
    throw new ApiError(400,"No refresh token recieved")
  }
 const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET_KEY)
 const user= await User.findById(decodedToken.id)
 if(!user)
 {
  throw new ApiError(400,"Unauthorized Access")
 }
 if(incomingRefreshToken!==user.refreshToken)
 {
  throw new ApiError(400,"Invalid Refresh Access Token")
 }
 const options={
  httpOnly:true,
  secure:true,
}
 const {newAccessToken,newRefreshToken}= await generateRefreshAndAccessToken(user._id)
 return res.status(200)
 .cookie("accessToken",newAccessToken,options)
 .cookie("refreshToken",newRefreshToken,options)
 .json(
  new ApiResponse(
    200,
    {
      newAccessToken,
      newRefreshToken,
    },
    "Access token refreshed successfully!"
  )
 )
 
})
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenGenerator
}