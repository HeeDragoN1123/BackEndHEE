

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



updateLike = async (userId, projectId) => {

}


}