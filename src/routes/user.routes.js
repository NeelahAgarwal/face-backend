import { Router } from "express";
import { loginUser, logoutUser, refreshTokenGenerator, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWTtoken } from "../middlewares/auth.middleware.js";
const router=Router()
router.route("/register").post(upload.fields([
  {
    name:"userImage1",
    maxCount:1
  },
  {
    name:"userImage2",
    maxCount:1
  },
  {
    name:"userImage3",
    maxCount:1
  }
]),registerUser)
// secured routes (user have to be logged in)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWTtoken,logoutUser)
router.route("/refreshToken-regeneration").post(refreshTokenGenerator)

export default router;