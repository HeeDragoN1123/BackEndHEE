import { CustomError } from "../errors/customError.js";
import { createAccessToken, createRefreshToken } from "../middlewares/auth.js";
import { UserRepository } from "./repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserService {
  userRepository = new UserRepository();

  /* name, nick, email에 해당하는 유저가 존재하면 에러메시지를 던짐 */
  findUserByName = async (name) => {
    const existName = await this.userRepository.findUserByName(name);
    if (existName) throw new CustomError(412, "이미 가입된 Name입니다");
  };
  findUserByEmail = async (email) => {
    const existEmail = await this.userRepository.findUserByEmail(email);
    if (existEmail) throw new CustomError(412, "이미 가입된 Email입니다");
  };
  findUserByNickname = async (nickname) => {
    const existNickname = await this.userRepository.findUserByNickname(nickname)
    if (existNickname) throw new CustomError(412, "이미 가입된 Nickname입니다");
  }

  signUp = async (
    name, nickname, email, password
  ) => {
    const user = await this.userRepository.signUp(
      name, nickname, email, password
    );

    /* response 메세지 반환 */
    return {
      name: user.name,
      nickname: user.nickame,
      email: user.email
    };
  };

  /* 회원가입, 비밀번호 일치여부 확인 */
  loginConfirm = async (name, password) => {
    const user = await this.userRepository.findUserByName(name);
    if (!user) throw new CustomError(404, "존재하지 않는 유저입니다");

    if (!(await bcrypt.compare(password, user.password)))
      throw new CustomError(400, "비밀번호가 일치하지 않습니다");

    /* 액세스, 리프레시 토큰을 생성해서 유저정보를 전달 */
    const accessToken = await createAccessToken(user);
    const refreshToken = await createRefreshToken(user);

    /* 리프레시 토큰을 유저 정보에 저정하는 메서드 */
    await this.userRepository.updateToken(name, refreshToken);

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

  /* 서버에서 발급한 refreshToken이 맞는지 검증 */
  validateToken = async (refreshToken) => {
    const { name } = jwt.verify(refreshToken, process.env.SECRET_KEY);

    /* 토큰에 저장된 유저정보 확인 */
    const user = await this.userRepository.validateToken(name);
    if (!user || refreshToken !== user.refreshToken)
      throw new CustomError(401, "리프레쉬 토큰 인증에 실패하였습니다");

    const accessToken = jwt.sign({ name: name }, process.env.SECRET_KEY, {
      expiresIn: 3600,
    });
    return accessToken;
  };

  /* req.params값을 상위 메서드에 전달*/
  getUserById = async (userId) => {
    const user = await this.userRepository.getUserById(userId);
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

  getPostByUserId = async (userId) => {
    const projects = await this.userRepository.getPostByUserId(userId);
    if (!projects) throw new CustomError(403, "게시글이 존재하지 않습니다");
    console.log(projects);

    const project = projects.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        viewsLogs: item._count.viewsLogs,
        likes: item._count.likes,
      };
    });
    console.log(project);

    return project;
  };

  updateUserInfo = async (email, avatarUrl, githubUrl,linkedinUrl, userId, userInfoId) => {
    if (userInfoId!==+userId) throw new CustomError(403, "권한이 없습니다")
    const userInfo = await this.userRepository.updateUserInfo(email, avatarUrl, githubUrl,linkedinUrl, userId)
    
    return {
      id: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      avatarUrl: userInfo.avatarUrl,
      githubUrl: userInfo.githubUrl,
      linkedinUrl: userInfo.linkedinUrl,
      createdAt: userInfo.createdAt
    }
  }

  getUserLikedProject = async (userId) => {
    const projects = await this.userRepository.getUserLikedProject(userId)

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

    return project
  }
}
