import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
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

export default router;