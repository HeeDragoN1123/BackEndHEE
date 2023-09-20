

export class LikeService{
    constructor(likeRepository){
        this.likeRepository = likeRepository
        }


findProjectById = async (projectId) =>{

    const likeCount = await this.likeRepository.findProjectById(projectId);

    return likeCount
}

getLikeById = async (userId) => {
    const likeCount = await this.likeRepository.getLikeById(userId);

    return likeCount
 }


//서비스에 deleteLike 메서드가 없음. 
updateLike = async (projectId , userId ) => {


let isLike = await this.likeRepository.isLike(projectId, userId);


if(!isLike) {
    await this.likeRepository.addLike(projectId, userId)
}else{
    await this.likeRepository.deleteLike(isLike.id)  //LikeId
}

    return isLike;
};


}