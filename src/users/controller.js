import {UserService} from "./service.js";

export class UserController {
  userService = new UserService();

  // 회원가입 메서드
  signUp = async (req, res, next) => {
    try {
      const { name, avatarUrl, email, password, description, githubUrl, linkedinUrl } = req.body;

      // 유니크 키 name, email로 중복유저 검증
      await this.userService.findUserByName(name)
      await this.userService.findUserByEmail(email)

      // req.body 데이터와 함께 상위 메서드 호출
      const data = await this.userService.signUp(name, avatarUrl, email, password, description, githubUrl, linkedinUrl)
      console.log(data)

      res.status(201).json({message: data})
    } catch (err) {
      next(err);
    }
  };

  // 로그인 메서드
  login = async (req, res, next) => {
    try {
      const {name, password} = req.body

      // name, password에 해당하는 유저 정보 확인
      const data = await this.userService.login(name, password)

      res.cookie("accessToken", data.accessToken)
      res.cookie("refreshToken", data.refreshToken)

      return res.status(200).json(data)

    } catch (err) {
      next(err)
    }
  }

}
