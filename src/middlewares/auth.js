import jwt from "jsonwebtoken";
import { userRepository } from "../users/repository.js";

const secretKey = process.env.SECRET_KEY;
/**
 * 사용자의 닉네임을 사용하여 액세스 토큰을 생성하는 함수.
 *
 * @async
 * @param {string} nickname - 사용자의 닉네임.
 * @returns {Promise<string>} - 생성된 액세스 토큰을 반환.
 */
const createAccessToken = async (nickname) => {
  const accessToken = jwt.sign({ nickname: nickname }, secretKey, {
    expiresIn: "10h",
  });

  return accessToken;
};
/**
 * 사용자의 닉네임을 사용하여 리프레시 토큰을 생성하는 함수.
 *
 * @async
 * @param {string} nickname - 사용자의 닉네임.
 * @returns {Promise<string>} - 생성된 리프레시 토큰을 반환.
 */
const createRefreshToken = async (nickname) => {
  const refreshToken = jwt.sign({ nickname: nickname }, secretKey, {
    expiresIn: "3d",
  });

  return refreshToken;
};

/**
 * 액세스 토큰의 유효성을 검사하는 미들웨어 함수.
 *
 * @async
 * @param {Object} req - Express 요청 객체.
 * @param {Object} res - Express 응답 객체.
 * @param {Function} next - 다음 미들웨어 함수 호출을 위한 콜백 함수.
 * @returns {void}
 */
const validateAccessToken = async (req, res, next) => {
  const { accessToken } = req.cookies;

  // 액세스 토큰이 존재하지 않는 경우 401 Unauthorized 응답 반환
  if (!accessToken) {
    return res
      .status(401)
      .json({ errorMessage: "엑세스 토큰이 존재하지 않습니다" });
  }

  const payload = validateToken(accessToken, secretKey);

  // 액세스 토큰이 만료된 경우 401 Unauthorized 응답 반환
  if (!payload) {
    return res
      .status(401)
      .json({ errorMessage: "Access Token이 만료되었습니다" });
  }

  const { nickname } = payload

  // 닉네임을 사용하여 사용자를 검색
  const user = await userRepository.findUserByField("nickname", nickname);

  // 사용자를 찾지 못한 경우 404 Not Found 응답 반환
  if (!user) {
    res.clearCookie("accessToken");

    return res.status(404).json({
      errorMessage: "해당하는 사용자를 찾을 수 없습니다.",
    });
  }

  // 요청 객체에 사용자 정보 추가
  req.user = user;

  console.log(user);
  next();
};

/**
 * 토큰을 검증하는 함수.
 *
 * @param {string} token - 검증할 토큰.
 * @param {string} key - 토큰을 검증하기 위한 시크릿 키.
 * @returns {Object|null} - 토큰이 유효한 경우 토큰의 페이로드를 반환하고, 그렇지 않으면 null 반환.
 */
const validateToken = (token, key) => {
  try {
    return jwt.verify(token, key);
  } catch (err) {
    return null;
  }
};

export {
  createAccessToken,
  createRefreshToken,
  validateAccessToken,
  validateToken,
};
