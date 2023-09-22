import { CustomError } from "../errors/customError.js";
import { createAccessToken, createRefreshToken } from "../middlewares/auth.js";
import { userRepository } from "./repository.js";
import passport from "passport";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * 이메일 주소를 사용하여 사용자를 검색하는 함수.
 *
 * @async
 * @param {string} email - 검색할 사용자의 이메일 주소.
 * @throws {CustomError} - 이미 가입된 이메일 주소인 경우 예외를 throw 함.
 * @returns {Promise<void>}
 */
const findUserByEmail = async (email) => {
  const existEmail = await userRepository.findUserByField("email", email);
  if (existEmail) throw new CustomError(412, "이미 가입된 Email입니다");
};

/**
 * 닉네임을 사용하여 사용자를 검색하는 함수.
 *
 * @async
 * @param {string} nickname - 검색할 사용자의 닉네임.
 * @throws {CustomError} - 이미 가입된 닉네임인 경우 예외를 throw 함.
 * @returns {Promise<void>}
 */
const findUserByNickname = async (nickname) => {
  const existNickname = await userRepository.findUserByField(
    "nickname",
    nickname
  );
  if (existNickname) throw new CustomError(412, "이미 가입된 Nickname입니다");
};

/**
 * 회원가입 처리 함수
 *
 * @async
 * @param {string} name - 사용자의 이름 (@중복값)
 * @param {string} nickname - 사용자의 닉네임 (@유니크)
 * @param {string} email - 사용자의 이메일 주소 (@유니크)
 * @param {string} password - 사용자의 password
 * @returns {Promise<void>} - 사용자 정보와 생성된 토큰을 포함한 객체를 반환
 */
const signUp = async (name, nickname, email, password) => {
  // userRepository를 사용하여 사용자 등록
  const user = await userRepository.signUp(name, nickname, email, password);

  // 사용자의 닉네임을 사용하여 토큰 생성
  const accessToken = await createAccessToken(nickname);
  const refreshToken = await createRefreshToken(nickname);

  // 사용자 정보와 생성된 토큰을 포함한 객체 반환
  return {
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

/**
 * 로그인 처리 함수.
 *
 * @async
 * @param {string} nickname - 사용자의 닉네임.
 * @param {string} password - 사용자의 비밀번호.
 * @returns {Promise<Object>} - 로그인 결과 및 생성된 토큰을 포함한 객체를 반환.
 * @throws {CustomError} - 유저를 찾을 수 없거나 비밀번호가 일치하지 않는 경우 예외를 throw 함.
 */
const login = async (nickname, password) => {
  // userRepository를 사용하여 닉네임을 기반으로 사용자 검색
  const user = await userRepository.findUserByField("nickname", nickname);

  if (!user) throw new CustomError(404, "존재하지 않는 유저입니다");

  if (!(await bcrypt.compare(password, user.password)))
    throw new CustomError(400, "비밀번호가 일치하지 않습니다");

  const accessToken = await createAccessToken(nickname);
  const refreshToken = await createRefreshToken(nickname);

  // userRepository를 사용하여 리프레시 토큰 업데이트
  await userRepository.updateToken(nickname, refreshToken);

  return {
    data: {
      Token: jwt.verify(accessToken, process.env.SECRET_KEY),
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        createdAt: user.createdAt,
      },
    },
    accessToken,
    refreshToken,
  };
};

/**
 * 리프레시 토큰을 사용하여 새로운 액세스 토큰을 생성하는 함수.
 *
 * @async
 * @param {string} refreshToken - 리프레시 토큰.
 * @returns {Promise<string>} - 생성된 액세스 토큰을 반환.
 * @throws {CustomError} - 리프레시 토큰 인증에 실패한 경우 예외를 throw 함.
 */
const reCreateAccessToken = async (refreshToken) => {
  const { nickname } = jwt.verify(refreshToken, process.env.SECRET_KEY);

  // userRepository를 사용하여 유저의 정보를 가져오기
  const user = await userRepository.validateToken(nickname);

  // 사용자가 없거나 리프레시 토큰이 일치하지 않으면 예외를 throw
  if (!user || refreshToken !== user.refreshToken)
    throw new CustomError(401, "리프레쉬 토큰 인증에 실패하였습니다");

  const accessToken = createAccessToken(nickname);

  return accessToken;
};
/**
 * 사용자 ID를 사용하여 사용자 정보를 가져오는 함수.
 *
 * @async
 * @param {number} userId - 가져올 사용자의 고유 ID.
 * @returns {Promise<Object>} - 사용자 정보를 포함한 객체를 반환.
 * @throws {CustomError} - 해당 사용자가 존재하지 않는 경우 예외를 throw 함.
 */
const findUserById = async (userId) => {
  // userRepository를 사용하여 주어진 사용자 ID로 사용자 정보 가져오기
  const user = await userRepository.findUserByField("userId", +userId);

  // 사용자가 존재하지 않으면 예외를 throw
  if (!user) throw new CustomError(403, "해당 유저가 존재하지 않습니다");

  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    avatarUrl: user.avatarUrl,
    githubUrl: user.githubUrl,
    linkedinUrl: user.linkedinUrl,
    createdAt: user.createdAt,
  };
};

/**
 * 사용자 ID를 사용하여 사용자가 작성한 프로젝트를 가져오는 함수.
 *
 * @async
 * @param {number} userId - 가져올 사용자의 고유 ID.
 * @returns {Promise<Object>} - 사용자가 작성한 게시글 정보를 객체로 반환.
 * @throws {CustomError} - 해당 게시글이 존재하지 않는 경우 예외를 throw 함.
 */
const getProjectByUserId = async (userId) => {
  const posts = await userRepository.getProjectByUserId(userId);

  if (!posts) throw new CustomError(403, "게시글이 존재하지 않습니다");

  const post = posts.map((item) => {
    return {
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      viewsLogs: item._count.viewsLogs,
      likes: item._count.likes,
    };
  });

  return post;
};
/**
 * 사용자 정보를 업데이트하는 함수.
 *
 * @async
 * @param {string} email - 업데이트할 이메일 주소.
 * @param {string} avatarUrl - 업데이트할 아바타 URL.
 * @param {string} githubUrl - 업데이트할 GitHub URL.
 * @param {string} linkedinUrl - 업데이트할 LinkedIn URL.
 * @param {string} userId - 업데이트할 사용자의 고유 ID.
 * @param {number} userInfoId - 현재 로그인한 사용자의 정보 ID.
 * @returns {Promise<Object>} - 업데이트된 사용자 정보를 포함한 객체를 반환.
 * @throws {CustomError} - 권한이 없거나 업데이트에 실패한 경우 예외를 throw 함.
 */
const updateUserInfo = async (
  email,
  avatarUrl,
  githubUrl,
  linkedinUrl,
  userId,
  userInfoId
) => {
  // 사용자 권한 확인: 현재 로그인한 사용자의 정보 ID와 업데이트 대상 사용자의 ID 비교
  if (userInfoId !== +userId) throw new CustomError(403, "권한이 없습니다");

  // userRepository를 사용하여 사용자 정보 업데이트
  const userInfo = await userRepository.updateUserInfo(
    email,
    avatarUrl,
    githubUrl,
    linkedinUrl,
    userId
  );

  return {
    id: userInfo.id,
    nickname: userInfo.nickname,
    email: userInfo.email,
    avatarUrl: userInfo.avatarUrl,
    githubUrl: userInfo.githubUrl,
    linkedinUrl: userInfo.linkedinUrl,
    createdAt: userInfo.createdAt,
  };
};

/**
 * 특정 사용자가 좋아요한 프로젝트 목록을 가져오는 함수.
 *
 * @async
 * @param {number} userId - 좋아요한 프로젝트를 가져올 사용자의 고유 ID.
 * @returns {Promise<Array>} - 좋아요한 프로젝트 정보를 포함한 배열을 반환.
 */
const getUserLikedProject = async (userId) => {
  // userRepository를 사용하여 특정 사용자가 좋아요한 프로젝트 목록을 가져옴
  const projects = await userRepository.getUserLikedProject(userId);

  // 가져온 프로젝트 정보를 매핑하여 필요한 속성만 포함한 배열로 변환
  const project = projects.map((item) => {
    return {
      id: item.id,
      title: item.title,
      thumbnail: item.image,
      category: item.category,
      viewCount: item._count.viewsLogs,
      likeCount: item._count.likes,
      createdAt: item.createdAt,
      authour: {
        id: item.users.id,
        username: item.users.name,
        avatarUrl: item.users.avatarUrl,
      },
    };
  });

  return project;
};

const googleLogin = async (req, res, next, method) => {
  console.log(method)
  passport.authenticate(method, async function (err, user, info) {
    console.log("user", user)
    const googleUser = await userRepository.googleAuth(user, method);
    console.log("googleUser", googleUser);

    const accessToken = createAccessToken(googleUser.email)
    return res.status(200).json(accessToken);
  })(req, res, next);
};

export const userService = {
  findUserByEmail,
  findUserByNickname,
  signUp,
  login,
  findUserById,
  getProjectByUserId,
  getUserLikedProject,
  updateUserInfo,
  reCreateAccessToken,
  googleLogin,
};
