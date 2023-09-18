import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { prisma } from "../utils/prisma/index.js";

/* 액세스토큰을 생성하는 함수 */
const createAccessToken = async (user) => {
  const accessToken = jwt.sign({ name: user.name }, process.env.SECRET_KEY, {
    expiresIn: "10h",
  });

  return accessToken;
};

/* 리프레시토큰을 생성하는 함수 */
const createRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ name: user.name }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return refreshToken;
};

/* 액세스토큰을 검증하는 함수 */
const validateAccessToken = async (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res
      .status(401)
      .json({ errorMessage: "엑세스 토큰이 존재하지 않습니다" });
  }

  /* 액세스 토큰 유효성 검증 */
  const payload = validateToken(accessToken, process.env.SECRET_KEY);

  if (!payload) {
    return res
      .status(401)
      .json({ errorMessage: "Access Token이 만료되었습니다" });
  }

  /* 토큰 정보에 담긴 사용자가 서버에 있는지 검증 */
  const { name } = jwt.verify(accessToken, process.env.SECRET_KEY);

  const user = await prisma.users.findFirst({
    where: { name },
  });
  if (!user) {
    res.clearCookie("accessToken");

    return res.status(404).json({
      errorMessage: "해당하는 사용자를 찾을 수 없습니다.",
    });
  }
  next();
};

const validateToken = (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};

export { createAccessToken, createRefreshToken, validateAccessToken };
