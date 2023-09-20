import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";

const findUserByField = async (field, value) => {
  return await prisma.users.findUnique({
    where: { [field]: value },
  });
};

export class UserRepository {
  /* DB에서 name, email로 중복데이터 확인 */

  findUserByName = async (name) => {
    const user = await prisma.users.findFirst({
      where: { name },
    });
    return user;
  };
  findUserByEmail = async (email) => {
    const user = await prisma.users.findFirst({
      where: { email },
    });
    return user;
  };
  findUserByNickname = async (nickname) => {
    const user = await prisma.users.findFirst({
      where: { nickname },
    });
    return user;
  };

  signUp = async (name, nickname, email, password) => {
    /* body데이터 DB에 저장(비밀번호는 암호화) */
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

  /* name과 일치하는 칼럼에 refresh토큰 저장 */
  updateToken = async (name, refreshToken) => {
    await prisma.users.update({
      where: { name },
      data: {
        refreshToken: refreshToken,
      },
    });
  };

  /* 리프레시 토큰에 담긴 정보로 유저 확인 */
  validateToken = async (name) => {
    const user = await prisma.users.findFirst({
      where: { name },
      select: {
        refreshToken: true,
      },
    });

    return user;
  };

  getUserById = async (userId) => {
    const user = await prisma.users.findFirst({
      where: { id: +userId },
    });

    return user;
  };

  getPostByUserId = async (userId) => {
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

  updateUserInfo = async (email, avatarUrl, githubUrl, linkedinUrl, userId) => {
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

  getUserLikedProject = async (userId) => {
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
}
