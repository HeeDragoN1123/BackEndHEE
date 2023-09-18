import express from "express";
import { UserController } from "./controller.js";

const router = express.Router();
const userController = new UserController();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);

export default router;
