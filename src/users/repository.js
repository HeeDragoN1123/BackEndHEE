import { prisma } from "../utils/prisma/index.js";

export class UserRepository {
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
    const user = await prisma.users.create({
      data: {
        name,
        avatarUrl,
        email,
        password,
        description,
        githubUrl,
        linkedinUrl,
      },
    });

    return user;
  };
}
