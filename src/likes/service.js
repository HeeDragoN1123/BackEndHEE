

export class LikeService{
    constructor(likeRepository){
        this.likeRepository = likeRepository
        }

//  getLike = async (userId, projectId) =>{
    


//  } 

findProjectById = async (projectId) =>{
    const like = await this.likeRepository.findProjectById(projectId);

}

getLikeById = async (userId) => {
    const like = await this.likeRepository.getLikeById(userId);

    return like
 }



updateLike = async (projectId , userId ) => {
//console.log("@@@@@@@@@@",isLike)

let isLike = await this.likeRepository.isLike(projectId , userId);

if(!isLike) {
    await this.likeRepository.addLike(projectId , userId)
}else{
    await this.likeRepository.deleteLike(likeId)
}

    return isLike;
};


}