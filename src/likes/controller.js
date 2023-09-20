export class LikeController {
  constructor(likeService) {
    this.likeService = likeService;
  }

  /* 좋아요 조회 */
  getLike = async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      await this.likeService.findProjectById(projectId);

      const post = await this.likeService.getLikeById(userId);

      return res.status(200).json( post );
    } catch (err) {
      next(err);
    }
  };

  /* 좋아요 작성 */

  updateLike = async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      await this.likeService.findProjectById(projectId);
      let isLikeExist = await this.likeService.updateLike(projectId, userId);

      if (isLikeExist) {
        return res.status(200).json({ message: "좋아요가 취소되었습니다" });
      } else {
        return res
          .status(200)
          .json({ message: `${projectId}번 게시글 좋아요+1` });
      }
    } catch (err) {
      next(err);
    }
  };
}
