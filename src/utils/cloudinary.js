import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key:process.env.CLOUDINARY_KEY , 
  api_secret:  process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary= async (localFilePath)=>{
 try {
   if(!localFilePath) return null;
   const response =await cloudinary.uploader.upload(localFilePath,{
     resource_type:"auto"
   })
   console.log("file has been uploaded successfully!!",response)
   return response;
 } catch (error) {
   fs.unlinkSync(localFilePath)
   return null;
 }
}
export {uploadOnCloudinary}