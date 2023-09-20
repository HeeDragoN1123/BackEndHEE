import { UserService } from "./service.js";
import { signUpSchema, loginSchema } from "../utils/joi/index.js";
import { createAccessToken, createRefreshToken } from "../middlewares/auth.js";

export class UserController {
  userService = new UserService();

  /* 회원가입 메서드 */
  signUp = async (req, res, next) => {
    try {
      const { name, nickname, email, password } =
        await signUpSchema.validateAsync(req.body);

      await this.userService.findUserByName(name);
      await this.userService.findUserByNickname(nickname);
      await this.userService.findUserByEmail(email);

      /* req.body 데이터와 함께 상위 메서드 호출 */
      const data = await this.userService.signUp(
        name, nickname, email, password
      );

      const accessToken = createAccessToken(nickname);
      const refreshToken = createRefreshToken(nickname);

      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);

      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  };

  /* 로그인 메서드 */
  login = async (req, res, next) => {
    try {
      const { name, password } = await loginSchema.validateAsync(req.body);

      // name, password에 해당하는 유저 정보 확인
      const { data, accessToken, refreshToken } =
        await this.userService.loginConfirm(name, password);

      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  /* 기존에 발급 리프레시 토큰 검증 */
  token = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res
          .status(401)
          .json({ errorMessage: "리프레시 토큰이 존재하지 않습니다" });
      }
      const accessToken = await this.userService.validateToken(refreshToken);

      res.cookie("accessToken", accessToken);

      return res
        .status(200)
        .json({ message: "액세스 토큰이 정상적으로 발급되었습니다" });
    } catch (err) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      next(err);
    }
  };

  /* req.params 값을 통해 유저 정보를 조회하는 메서드 */
  getUserInfo = async (req, res, next) => {
    try {
      const { userId } = req.params;

      const userInfo = await this.userService.getUserById(userId);

      return res.status(200).json(userInfo);
    } catch (err) {
      next(err);
    }
  };
  getPost = async (req, res, next) => {
    try {
      const { userId } = req.params;
      await this.userService.getUserById(userId);

      const workedProject = await this.userService.getPostByUserId(userId);

      return res.status(200).json({ workedProject });
    } catch (err) {
      next(err);
    }
  };
  updateUserInfo = async (req, res, next) => {
    try {
      const { email, avatarUrl, githubUrl, linkedinUrl } = req.body;
      const { userId } = req.params;
      const userInfoId = req.user.id;

      await this.userService.getUserById(userId);

      const userInfo = await this.userService.updateUserInfo(
        email,
        avatarUrl,
        githubUrl,
        linkedinUrl,
        userId,
        userInfoId
      );

      return res.status(200).json(userInfo);
    } catch (err) {
      next(err);
    }
  };

  getUserLikedProject = async (req, res, next) => {
    try {
      const { userId } = req.params;

      const projects = await this.userService.getUserLikedProject(userId);

      console.log(projects);

      return res.status(200).json(projects);
    } catch (err) {
      next(err);
    }
  };
}
