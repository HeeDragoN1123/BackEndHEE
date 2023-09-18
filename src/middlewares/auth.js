import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const createAccessToken = async (user) => {
  const accessToken = jwt.sign({ name: user.name }, process.env.SECRET_KEY, {
    expiresIn: 3600,
  });

  return accessToken;
};

const createRefreshToken = async (user) => {
  const refreshToken = jwt.sign({ name: user.name }, process.env.SECRET_KEY, {
    expiresIn: 86400,
  });

  return refreshToken;
};

export { createAccessToken, createRefreshToken };
