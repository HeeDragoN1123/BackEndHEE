//import LikeService from './service.js';


export  class LikeController{

constructor(likeService) {
    this.likeService = likeService;
    }

// likeService = new LikeService();


/* 좋아요 조회 */
getLike = async(req,res, next) =>{
    const {projectId} = req.params;
    const userId = req.user.id;

    await this.likeService.findProjectById(projectId);


    const post = await this.likeService.getLikeById(userId);


    return res.status(200).json({ post });
}

/* 좋아요 업데이트 */

updateLike= async(req,res,next) =>{
const {projectId} = req.params;
const userId = req.user.id;

await this.likeService.updateLike(projectId, userId);




}

}
