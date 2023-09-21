import { UserService } from "./service.js";
import { signUpSchema, loginSchema } from "../utils/joi/index.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../middlewares/auth/auth.js";
import { asyncHandler } from "../middlewares/auth/asynchandler.js";

export class UserController {
  userService = new UserService();

  /* 회원가입 메서드 */
  signUp = asyncHandler(async (req, res) => {
    const { name, nickname, email, password } =
      await signUpSchema.validateAsync(req.body);

    await this.userService.findUserByName(name);
    await this.userService.findUserByNickname(nickname);
    await this.userService.findUserByEmail(email);

    /* req.body 데이터와 함께 상위 메서드 호출 */
    const data = await this.userService.signUp(name, nickname, email, password);

    const accessToken = createAccessToken(nickname);
    const refreshToken = createRefreshToken(nickname);

    res.cookie("accessToken", accessToken);
    res.cookie("refreshToken", refreshToken);

    res.status(201).json(data);
  });

  /* 로그인 메서드 */
  login = asyncHandler(async (req, res) => {
    const { name, password } = await loginSchema.validateAsync(req.body);

    // name, password에 해당하는 유저 정보 확인
    const { data, accessToken, refreshToken } =
      await this.userService.loginConfirm(name, password);

    res.cookie("accessToken", accessToken);
    res.cookie("refreshToken", refreshToken);

    return res.status(200).json(data);
  });

  /* 기존에 발급 리프레시 토큰 검증 */
  token = asyncHandler(async (req, res) => {
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
    // res.clearCookie("accessToken");
    // res.clearCookie("refreshToken");
  });

  /* req.params 값을 통해 유저 정보를 조회하는 메서드 */
  getUserInfo = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;

    const userInfo = await this.userService.getUserById(userId);

    return res.status(200).json(userInfo);
  });
  getPost = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    await this.userService.getUserById(userId);

    const workedProject = await this.userService.getPostByUserId(userId);

    return res.status(200).json({ workedProject });
  });
  updateUserInfo = asyncHandler(async (req, res, next) => {
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
  });

  getUserLikedProject = asyncHandler(async (req, res, next) => {
      const { userId } = req.params;

      const projects = await this.userService.getUserLikedProject(userId);

      console.log(projects);

      return res.status(200).json(projects);
  });
}
