import { CustomError } from "../errors/customError.js";
import { UserRepository } from "./repository.js";

export class UserService {
  userRepository = new UserRepository();

  findUserByName = async (name) => {
    const existName = await this.userRepository.findUserByName(name);
    if (existName) throw new CustomError(412, "이미 가입된 유저입니다")
  };
  findUserByEmail = async (email) => {
    const existEmail = await this.userRepository.findUserByEmail(email)
    if (existEmail) throw new CustomError(412, "이미 가입된 유저입니다")
  }

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
}
