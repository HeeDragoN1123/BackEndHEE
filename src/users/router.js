import express from "express";
import { UserController } from "./controller.js";
import { validateAccessToken } from "../middlewares/auth.js";

const router = express.Router();
const userController = new UserController();

/* 회원가입 API */
router.post("/signup", userController.signUp);

/* 로그인 API */
router.post("/login", userController.login);

/* 사용자 정보 확인 API */
router.get("/user/:userId", validateAccessToken, userController.getUserInfo)

/* 사용자가 작성한 게시글 확인 API */
router.get("/user/:userId/project", validateAccessToken, userController.getPost)

/* 액세스 토큰 재발급 API */
router.get("/token", userController.token)


export default router;
