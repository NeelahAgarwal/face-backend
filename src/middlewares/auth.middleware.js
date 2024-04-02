import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";



export const verifyJWTtoken=asyncHandler(async (req,_,next)=>{
 try {
  const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
  if(!token)
  {
   throw new ApiError(402,"Unauthorized Access")
  }
  const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET_KEY)
  console.log("verified user")
  const user =await User.findById(decodedToken?.id)
  if(!user)
  {
   throw new ApiError(401,"Invalid Access Token")
  }
  req.user=user
  next()
 } catch (error) {
  throw new ApiError(401,error?.message||"Invalid Access Token")
 }
})