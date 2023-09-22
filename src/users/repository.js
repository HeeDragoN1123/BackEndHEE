import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";

/**
 * 특정 필드의 값을 기준으로 사용자를 검색하는 함수.
 *
 * @async
 * @param {string} field - 검색할 필드 이름 (예: "email" 또는 "nickname").
 * @param {string} value - 검색할 필드의 값.
 * @returns {Promise<Object|null>} - 검색 결과를 포함한 객체를 반환. 사용자를 찾지 못한 경우 null 반환.
 */
const findUserByField = async (field, value) => {
   // 특정 필드의 값을 기준으로 사용자 검색
  return await prisma.users.findUnique({
    where: { [field]: value },
  });
};

/**
 * 사용자 등록 함수.
 *
 * @async
 * @param {string} name - 사용자의 이름.
 * @param {string} nickname - 사용자의 닉네임.
 * @param {string} email - 사용자의 이메일 주소.
 * @param {string} password - 사용자의 비밀번호.
 * @returns {Promise<Object>} - 등록된 사용자 정보를 포함한 객체를 반환.
 */
const signUp = async (name, nickname, email, password) => {

  // 비밀번호를 해싱하여 저장
  const hashedpassword = await bcrypt.hash(password, 10);

  const user = await prisma.users.create({
    data: {
      name,
      nickname,
      email,
      password: hashedpassword,
    },
  });

  return user;
};
/**
 * 사용자의 리프레시 토큰을 업데이트하는 함수.
 *
 * @async
 * @param {string} nickname - 사용자의 닉네임.
 * @param {string} refreshToken - 새로운 리프레시 토큰 값.
 */
const updateToken = async (nickname, refreshToken) => {
  await prisma.users.update({
    where: { nickname },
    data: {
      refreshToken,
    },
  });
};

/**
 * 사용자의 닉네임으로 사용자의 리프레시 토큰을 찾는 함수.
 *
 * @async
 * @param {string} nickname - 사용자의 닉네임
 * @returns {Promise<string|null>} - 사용자의 리프레시 토큰을 반환. 사용자를 찾지 못한 경우 null 반환.
 */
const validateToken = async (nickname) => {
  const user = await prisma.users.findFirst({
    where: { nickname },
    select: {
      refreshToken: true,
    },
  });

  return user;
};

/**
 * 특정 사용자가 생성한 프로젝트 목록을 가져오는 함수.
 *
 * @async
 * @param {number} userId - 프로젝트 목록을 가져올 사용자의 고유 ID.
 * @returns {Promise<Array>} - 사용자가 생성한 프로젝트 정보를 포함한 배열을 반환.
 */

const getProjectByUserId = async (userId) => {
  const post = await prisma.projects.findMany({
    where: {
      userId: +userId,
    },

    include: {
      _count: {
        select: {
          likes: true,
          viewsLogs: true,
          bookmarks: true,
        },
      },
    },
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
 * @returns {Promise<Object>} - 업데이트된 사용자 정보를 포함한 객체를 반환.
 */
const updateUserInfo = async (
  email,
  avatarUrl,
  githubUrl,
  linkedinUrl,
  userId
) => {
  const user = await prisma.users.update({
    where: { id: +userId },
    data: {
      email,
      avatarUrl,
      githubUrl,
      linkedinUrl,
    },
  });
  return user;
};
/**
 * 특정 사용자가 좋아요한 프로젝트 목록을 가져오는 함수.
 *
 * @async
 * @param {number} userId - 좋아요한 프로젝트를 가져올 사용자의 고유 ID.
 * @returns {Promise<Array>} - 좋아요한 프로젝트 정보를 포함한 배열을 반환.
 */
const getUserLikedProject = async (userId) => {
  const projects = await prisma.projects.findMany({
    where: {
      likes: {
        some: {
          userId: +userId,
        },
      },
    },
    select: {
      id: true,
      title: true,
      image: true,
      category: true,
      createdAt: true,
      users: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          likes: true,
          viewsLogs: true,
          bookmarks: true,
        },
      },
    },
  });
  return projects;
};

const updateIsEmailVerified = async (email) => {

  const user = await prisma.users.update({
    where: {email},
    data: {
      isEmailVerified: true
    }
  })

  return user.isEmailVerified
}

const googleAuth = async (user, method) => {
  const googleuser = await prisma.users.create({
    data: {
      name: user.emails[0].value,
      nickname: user.displayName,
      email: user.emails[0].value,
      password: user.emails[0].value
    },
  });

  return googleuser
}



export const userRepository = {
  signUp,
  findUserByField,
  getProjectByUserId,
  getUserLikedProject,
  validateToken,
  updateUserInfo,
  updateToken,
  updateIsEmailVerified,
  googleAuth
};
