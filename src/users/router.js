import express from "express";
import { userController } from "./controller.js";
import { validateAccessToken } from "../middlewares/auth.js";
import { emailAuth, verifyLink } from "../middlewares/auth.email.js";
import passport from "passport";

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
/* 이메일 인증메일 검증 API */
router.get("/verifyLink", verifyLink);

//* 구글로 로그인하기 라우터 ***********************
router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
); // 프로파일과 이메일 정보를 받는다.

//위에서 구글 서버 로그인이 되면, 네이버 redirect url 설정에 따라 이쪽 라우터로 오게 된다. 인증 코드를 박게됨
router.get(
  "/login/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

/* 로그아웃 */
router.get('/logout',userController.logout)

export default router;
