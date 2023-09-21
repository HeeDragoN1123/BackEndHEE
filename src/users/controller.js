import { userService } from "./service.js";
import { signUpSchema, loginSchema } from "../utils/joi/index.js";
import { asyncHandler } from "../middlewares/asynchandler.js";

/* 회원가입 메서드 */
const signUp = asyncHandler(async (req, res) => {
  const { name, nickname, email, password } = await signUpSchema.validateAsync(
    req.body
  );

  await userService.findUserByEmail(email);
  await userService.findUserByNickname(nickname);

  /* req.body 데이터와 함께 상위 메서드 호출 */
  const data = await userService.signUp(name, nickname, email, password);

  res.cookie("accessToken", data.accessToken);
  res.cookie("refreshToken", data.refreshToken);

  res.status(201).json(data);
});

/* 로그인 메서드 */
const login = asyncHandler(async (req, res) => {
  const { nickname, password } = await loginSchema.validateAsync(req.body);

  // name, password에 해당하는 유저 정보 확인
  const { data, accessToken, refreshToken } = await userService.login(
    nickname,
    password
  );

  res.cookie("accessToken", accessToken);
  res.cookie("refreshToken", refreshToken);

  return res.status(200).json(data);
});

/* 기존에 발급 리프레시 토큰 검증 */
const reCreateAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ errorMessage: "리프레시 토큰이 존재하지 않습니다" });
  }
  const accessToken = await userService.validateToken(refreshToken);

  res.cookie("accessToken", accessToken);

  return res
    .status(200)
    .json({ message: "액세스 토큰이 정상적으로 발급되었습니다" });
  // res.clearCookie("accessToken");
  // res.clearCookie("refreshToken");
});

/* req.params 값을 통해 유저 정보를 조회하는 메서드 */
const getUserInfo = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const userInfo = await userService.getUserById(userId);

  return res.status(200).json(userInfo);
});

const getPost = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  await userService.getUserById(userId);

  const workedProject = await userService.getProjectByUserId(userId);

  return res.status(200).json(workedProject);
});

const updateUserInfo = asyncHandler(async (req, res) => {
  const { email, avatarUrl, githubUrl, linkedinUrl } = req.body;
  const { userId } = req.params;
  const userInfoId = req.user.id;

  await userService.getUserById(userId);

  const userInfo = await userService.updateUserInfo(
    email,
    avatarUrl,
    githubUrl,
    linkedinUrl,
    userId,
    userInfoId
  );

  return res.status(200).json(userInfo);
});

const getUserLikedProject = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const projects = await userService.getUserLikedProject(userId);

  return res.status(200).json(projects);
});

export const userController = {
  login,
  signUp,
  reCreateAccessToken,
  getUserInfo,
  getPost,
  updateUserInfo,
  getUserLikedProject,
};
