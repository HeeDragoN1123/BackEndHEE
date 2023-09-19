import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";

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

  signUp = async (
    name,
    avatarUrl,
    email,
    password,
    description,
    githubUrl,
    linkedinUrl
  ) => {
    /* body데이터 DB에 저장(비밀번호는 암호화) */
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        name,
        avatarUrl,
        email,
        password: hashedpassword,
        description,
        githubUrl,
        linkedinUrl,
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
}
