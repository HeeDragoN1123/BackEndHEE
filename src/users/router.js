import express from "express";
import { UserController } from "./controller.js";

const router = express.Router();
const userController = new UserController();

/* 회원가입 API */
router.post("/signup", userController.signUp);

/* 로그인 API */
router.post("/login", userController.login);

export default router;
