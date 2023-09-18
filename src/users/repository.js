import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt"

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
    const hashedpassword = await bcrypt.hash(password, 10)
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
}
