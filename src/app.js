import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app=express()
app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))
app.use(express.json({
  limit:"25mb"
}))
app.use(express.urlencoded({
  limit:"16kb",
  extended:true,
}))
app.use(express.static("public"))
app.use(cookieParser())

// routes
import userRouter from "./routes/user.routes.js"
//routeDeclaration
app.use("/api/v1/users",userRouter)
export {app}