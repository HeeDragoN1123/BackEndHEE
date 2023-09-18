import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

// 액세스토큰을 생성하는 함수
const createAccessToken = async (user) => {
  const accessToken = jwt.sign({ name: user.name }, process.env.SECRET_KEY, {
    expiresIn: 3600,
  });

  return accessToken;
};

// 리프레시토큰을 생성하는 함수
const createRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ name: user.name }, process.env.SECRET_KEY, {
    expiresIn: 86400,
  });

  return refreshToken;
};

// 액세스토큰을 검증하는 함수
const validateAccessToken = async (req, res) => {
    const {accessToken} = req.cookies

    if (!accessToken) {
        return res.status(401).json({errorMessage: "엑세스 토큰이 존재하지 않습니다"})
    }
}

export { createAccessToken, createRefreshToken };
