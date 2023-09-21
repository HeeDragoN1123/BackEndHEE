import express from "express";
import { userController } from "./controller.js";
import { validateAccessToken } from "../middlewares/auth.js";
import { emailAuth, verifyToken } from "../middlewares/auth.email.js";

const router = express.Router();

/* 회원가입 API */
router.post("/signup", userController.signUp);

/* 로그인 API */
router.post("/login", userController.login);

/* 유저 정보 확인 API */
router.get("/user/:userId", validateAccessToken, userController.getUserInfo);

/* 유저가 작성한 게시글 확인 API */
router.get(
  "/user/:userId/project",
  validateAccessToken,
  userController.getProjectByUserId
);

/* 유저 정보 수정 API */
router.put("/user/:userId", validateAccessToken, userController.updateUserInfo);

/* 유저가 좋아요 한 게시글 조회 API */
router.get(
  "/:userId/like",
  validateAccessToken,
  userController.getUserLikedProject
);

/* 액세스 토큰 재발급 API */
router.get("/token", userController.reCreateAccessToken);

/* 이메일 인증 API */
router.post("/emailCheck", emailAuth);

router.get("/verifyLink", verifyToken);

export default router;
