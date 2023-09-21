import { userService } from "./service.js";
import { signUpSchema, loginSchema } from "../utils/joi/index.js";
import { asyncHandler } from "../middlewares/asynchandler.js";

/**
 * 사용자 회원가입 처리를 수행하는 함수.
 *
 * @async
 * @param {Object} req - Express 요청 객체.
 * @param {Object} res - Express 응답 객체.
 * @returns {Promise<void>}
 */
const signUp = asyncHandler(async (req, res) => {
  const { name, nickname, email, password } = await signUpSchema.validateAsync(
    req.body
  );
    // 동일한 이메일 주소가 이미 존재하는지 확인
  await userService.findUserByEmail(email);

  // 동일한 닉네임이 이미 존재하는지 확인
  await userService.findUserByNickname(nickname);

  // userService를 사용하여 회원가입 처리
  const data = await userService.signUp(name, nickname, email, password);

  // 회원가입 성공 시 Access Token과 Refresh Token을 쿠키로 설정
  res.cookie("accessToken", data.accessToken);
  res.cookie("refreshToken", data.refreshToken);

  res.status(201).json(data);
});

/**
 * 사용자 로그인 처리를 수행하는 핸들러 함수.
 *
 * @async
 * @param {Object} req - Express 요청 객체.
 * @param {Object} res - Express 응답 객체.
 * @returns {Promise<void>}
 */
const login = asyncHandler(async (req, res) => {
  const { nickname, password } = await loginSchema.validateAsync(req.body);

  // userService를 사용하여 로그인 처리
  const { data, accessToken, refreshToken } = await userService.login(
    nickname,
    password
  );

  // 로그인 성공 시 Access Token과 Refresh Token을 쿠키로 설정
  res.cookie("accessToken", accessToken);
  res.cookie("refreshToken", refreshToken);

  return res.status(200).json(data);
});

/**
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 생성하는 핸들러 함수.
 *
 * @async
 * @param {Object} req - Express 요청 객체.
 * @param {Object} res - Express 응답 객체.
 * @returns {Promise<void>}
 */
const reCreateAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  // 리프레시 토큰이 없을 경우 에러 응답 반환
  if (!refreshToken) {
    return res
      .status(401)
      .json({ errorMessage: "리프레시 토큰이 존재하지 않습니다" });
  }
  // userService를 사용하여 리프레시 토큰을 검증하고 새로운 액세스 토큰 생성
  const accessToken = await userService.reCreateAccessToken(refreshToken);

  // 생성된 액세스 토큰을 쿠키로 설정
  res.cookie("accessToken", accessToken);

  return res
    .status(200)
    .json({ message: "액세스 토큰이 정상적으로 발급되었습니다" });
});

/**
 * 사용자 정보를 가져오는 함수.
 *
 * @async
 * @param {Object} req - Express 요청 객체.
 * @param {Object} res - Express 응답 객체.
 * @returns {Promise<void>}
 */
const getUserInfo = asyncHandler(async (req, res) => {
  const { userId } = req.params;

// userService를 사용하여 사용자 정보를 가져옴
  const userInfo = await userService.getUserById(userId);

  return res.status(200).json(userInfo);
});
/** 
 * 유저 아이디를 통해 프로젝트를 가져오는 함수.
 * 
 * @async
 * @param {Object} req - Express 요청 객체.
 * @param {Object} ree - Express 응답 객체.
 * @return {Promise<void>} 
 */ 
const getProjectByUserId = asyncHandler(async (req, res) => {

  const { userId } = req.params;

  // 요청파라미터 해당 유저 확인
  await userService.getUserById(userId);

  // userService를 사용하여 프로젝트를 가져옴
  const workedProject = await userService.getProjectByUserId(userId);

  return res.status(200).json(workedProject);
});

/**
 * 사용자 정보를 업데이트하는 핸들러 함수.
 *
 * @async
 * @param {Object} req - Express 요청 객체.
 * @param {Object} res - Express 응답 객체.
 * @returns {Promise<void>}
 */
const updateUserInfo = asyncHandler(async (req, res) => {
  const { email, avatarUrl, githubUrl, linkedinUrl } = req.body;
  const { userId } = req.params;
  const userInfoId = req.user.id;

  // userService를 사용하여 요청된 사용자 정보 가져오기
  await userService.getUserById(userId);

   // userService를 사용하여 사용자 정보 업데이트
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

/**
 * 사용자 정보가 좋아요한 게시물을 가져오는 함수
 *
 * @async
 * @param {Object} req - Express 요청 객체.
 * @param {Object} res - Express 응답 객체.
 * @returns {Promise<void>}
 */
const getUserLikedProject = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // userService를 사용하여 좋아요한 게시글 조회
  const projects = await userService.getUserLikedProject(userId);

  return res.status(200).json(projects);
});

export const userController = {
  login,
  signUp,
  reCreateAccessToken,
  getUserInfo,
  getProjectByUserId,
  updateUserInfo,
  getUserLikedProject,
};
