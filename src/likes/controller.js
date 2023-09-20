
export class LikeController {
  constructor(likeService) {
    this.likeService = likeService;
  }

 

  /* 좋아요 조회 */
  getLike = async (req, res, next) => {
    try{
      const { projectId } = req.params;
      const userId = req.user.id;
     
      await this.likeService.findProjectById(projectId);
  
      const likeCount = await this.likeService.getLikeById(userId);
      
      return res.status(200).json({ likeCount });
    }catch(err){
      next();
    }

  };


 /* 좋아요 업데이트 */

  updateLike = async (req, res, next) => {
    try{
      const { projectId } = req.params;
      const userId = req.user.id;
  
      await this.likeService.findProjectById(projectId);
      let isLike = await this.likeService.updateLike(projectId, userId);
      
      if (isLike) {
        if (userId !== isLike.UserId) {
          return res.status(200).json({ message: "좋아요가 취소되었습니다" });
        }
      } else {
        return res.status(200).json({ message: `${projectId}번 게시글 좋아요+1` });
      }
      return res.status(200).json({ message: `${projectId}번 게시글 좋아요+1` });

    }catch(err){
      next(err);
    }

  };
}