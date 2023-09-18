import express from "express"
import UserController from "./controller.js"

const router = express.Router()
const usercontroller = new UserController()

router.post('/signup', usercontroller.signup)

export default router