import { CustomError } from "../errors/customError.js";
import { createAccessToken, createRefreshToken } from "../middlewares/auth.js";
import { UserRepository } from "./repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  userRepository = new UserRepository();

  findUserByName = async (name) => {
    const existName = await this.userRepository.findUserByName(name);
    if (existName) throw new CustomError(412, "이미 가입된 유저입니다");
  };
  findUserByEmail = async (email) => {
    const existEmail = await this.userRepository.findUserByEmail(email);
    if (existEmail) throw new CustomError(412, "이미 가입된 유저입니다");
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
    const user = await this.userRepository.signUp(
      name,
      avatarUrl,
      email,
      password,
      description,
      githubUrl,
      linkedinUrl
    );

    return {
      name: user.name,
      createdAt: user.createdAt,
    };
  };

  login = async (name, password) => {
    const user = await this.userRepository.findUserByName(name);
    if (!user) throw new CustomError(404, "존재하지 않는 유저입니다");

    if (!(await bcrypt.compare(password, user.password)))
      throw new CustomError(400, "비밀번호가 일치하지 않습니다");

    const accessToken = await createAccessToken(user);
    const refreshToken = await createRefreshToken(user);

    // await this.userRepository.saveToken(refreshToken)

    return {
      Token: jwt.verify(accessToken, process.env.SECRET_KEY),
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  };
}
