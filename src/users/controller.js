import { UserService } from "./service.js";

export class UserController {
  userService = new UserService();

  /* 회원가입 메서드 */
  signUp = async (req, res, next) => {
    try {
      const {
        name,
        avatarUrl,
        email,
        password,
        description,
        githubUrl,
        linkedinUrl,
      } = req.body;

      /* 유니크 키 name, email로 중복유저 검증 */
      await this.userService.findUserByName(name);
      await this.userService.findUserByEmail(email);

      /* req.body 데이터와 함께 상위 메서드 호출 */
      const data = await this.userService.signUp(
        name,
        avatarUrl,
        email,
        password,
        description,
        githubUrl,
        linkedinUrl
      );
      console.log(data);

      res.status(201).json({ message: data });
    } catch (err) {
      next(err);
    }
  };

  /* 로그인 메서드 */
  login = async (req, res, next) => {
    try {
      const { name, password } = req.body;

      // name, password에 해당하는 유저 정보 확인
      const {data, accessToken, refreshToken} = await this.userService.loginConfirm(name, password);

      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  /* 기존에 발급 리프레시 토큰 검증 */
  token = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res
          .status(401)
          .json({ errorMessage: "리프레시 토큰이 존재하지 않습니다" });
      }
      const accessToken = await this.userService.validateToken(refreshToken);

      res.cookie('accessToken', accessToken)
    } catch (err) {
      res.clearCookie('accessToken')
      res.clearCookie('refreshToken')

      next(err);
    }
  };

  /* req.params 값을 통해 유저 정보를 조회하는 메서드 */
  getUserInfo = async (req, res, next) => {
    try {
      const {userId} = req.params

      const userInfo = await this.userService.getUserById(userId)
      console.log(userInfo)

      return res.status(200).json(userInfo)
    } catch (err) {
      next(err)
    }
  }
}
