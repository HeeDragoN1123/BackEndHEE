import { CustomError } from "../errors/customError.js";
import { createAccessToken, createRefreshToken } from "../middlewares/auth.js";
import { userRepository } from "./repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const findUserByEmail = async (email) => {
  const existEmail = await userRepository.findUserByField("email", email);
  if (existEmail) throw new CustomError(412, "이미 가입된 Email입니다");
};
const findUserByNickname = async (nickname) => {
  const existNickname = await userRepository.findUserByField(
    "nickname", nickname
  );
  if (existNickname) throw new CustomError(412, "이미 가입된 Nickname입니다");
};

const signUp = async (name, nickname, email, password) => {
  const user = await userRepository.signUp(name, nickname, email, password);

  const accessToken = await createAccessToken(nickname);
  const refreshToken = await createRefreshToken(nickname);

  return {
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    accessToken,
    refreshToken,
  };
};

const login = async (nickname, password) => {
  const user = await userRepository.findUserByField("nickname", nickname);
  console.log(user)
  if (!user) throw new CustomError(404, "존재하지 않는 유저입니다");

  if (!(await bcrypt.compare(password, user.password)))
    throw new CustomError(400, "비밀번호가 일치하지 않습니다");

  const accessToken = await createAccessToken(nickname);
  const refreshToken = await createRefreshToken(nickname);

  await userRepository.updateToken(nickname, refreshToken);

  return {
    data: {
      Token: jwt.verify(accessToken, process.env.SECRET_KEY),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    },
    accessToken,
    refreshToken,
  };
};

const validateToken = async (refreshToken) => {
  const { name } = jwt.verify(refreshToken, process.env.SECRET_KEY);

  const user = await userRepository.validateToken(name);
  if (!user || refreshToken !== user.refreshToken)
    throw new CustomError(401, "리프레쉬 토큰 인증에 실패하였습니다");

  const accessToken = jwt.sign({ name: name }, process.env.SECRET_KEY, {
    expiresIn: 3600,
  });
  return accessToken;
};

const getUserById = async (userId) => {
  const user = await userRepository.getUserById(userId);
  if (!user) throw new CustomError(403, "해당 유저가 존재하지 않습니다");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    githubUrl: user.githubUrl,
    linkedinUrl: user.linkedinUrl,
    createdAt: user.createdAt,
  };
};

const getProjectByUserId = async (userId) => {
  const posts = await userRepository.getProjectByUserId(userId);
  if (!posts) throw new CustomError(403, "게시글이 존재하지 않습니다");
  console.log(posts);

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
  console.log(post);

  return post;
};

const updateUserInfo = async (
  email,
  avatarUrl,
  githubUrl,
  linkedinUrl,
  userId,
  userInfoId
) => {
  if (userInfoId !== +userId) throw new CustomError(403, "권한이 없습니다");
  const userInfo = await userRepository.updateUserInfo(
    email,
    avatarUrl,
    githubUrl,
    linkedinUrl,
    userId
  );

  return {
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    avatarUrl: userInfo.avatarUrl,
    githubUrl: userInfo.githubUrl,
    linkedinUrl: userInfo.linkedinUrl,
    createdAt: userInfo.createdAt,
  };
};

const getUserLikedProject = async (userId) => {
  const projects = await userRepository.getUserLikedProject(userId);

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

export const userService = {
  findUserByEmail,
  findUserByNickname,
  signUp,
  login,
  getUserById,
  getProjectByUserId,
  getUserLikedProject,
  updateUserInfo,
  validateToken,
};
