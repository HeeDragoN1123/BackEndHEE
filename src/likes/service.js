

export class LikeService{
    constructor(likeRepository){
        this.likeRepository = likeRepository
        }

//  getLike = async (userId, projectId) =>{
    


//  } 

findProjectById = async (projectId) =>{
    // console.log("&&&&&&&&&&&",like)
    const like = await this.likeRepository.findProjectById(projectId);
}

getLikeById = async (userId) => {
    //console.log("&&&&&&&&&&&",like)
    const likeCount = await this.likeRepository.getLikeById(userId);

    return likeCount
 }


//서비스에 deleteLike 메서드가 없음. 
updateLike = async (projectId , userId ) => {
//console.log("@@@@@@@@@@",isLike)

let isLike = await this.likeRepository.isLike(projectId, userId);


// if (isLike) {
//     await this.likeRepository.deleteLike(isLike.likeId)
// } else {
//     await this.likeRepository.addLike(userId, postId)
// }

//console.log(isLike.id)

if(!isLike) {
    await this.likeRepository.addLike(projectId, userId)
}else{
    await this.likeRepository.deleteLike(isLike.id)  //LikeId
}

    return isLike;
};


}