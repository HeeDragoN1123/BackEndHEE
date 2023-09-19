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

await this.likeService.findProjectById(projectId);

let isLike = await this.likeService.updateLike(projectId, userId);

//체크필요
if(!isLike) {
    //return res.status(200).json({messege : `${projectId}번 게시글 좋아요가 등록되었습니다.`})
    return res.status(200).json({isLike})

}else{
await this.likeService.deleteLike({
    where : {likeId : isLike.id},
});
    return res.status(200).json({messege : `${projectId}번 게시글 좋아요가 취소되었습니다.`})
}


}

}
