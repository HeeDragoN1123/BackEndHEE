import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";

const findUserByField = async (field, value) => {
  return await prisma.users.findUnique({
    where: { [field]: value },
  });
};

const signUp = async (name, nickname, email, password) => {

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

const updateToken = async (nickname, refreshToken) => {
  await prisma.users.update({
    where: { nickname },
    data: {
      refreshToken,
    },
  });
};

const validateToken = async (name) => {
  const user = await prisma.users.findFirst({
    where: { name },
    select: {
      refreshToken: true,
    },
  });

  return user;
};

const getUserById = async (userId) => {
  const user = await prisma.users.findFirst({
    where: { id: +userId },
  });

  return user;
};

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
  console.log(projects);
  return projects;
};

export const userRepository = {
  signUp,
  findUserByField,
  getProjectByUserId,
  getUserById,
  getUserLikedProject,
  validateToken,
  updateUserInfo,
  updateToken,
};
