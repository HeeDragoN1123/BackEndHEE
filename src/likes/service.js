
export class LikeService{
    constructor(likeRepository){
        this.likeRepository = likeRepository
        }


findProjectById = async (projectId) =>{
    const like = await this.likeRepository.findProjectById(projectId); 
    return like
};

getLikeById = async (userId) => {
    const likes = await this.likeRepository.getLikeById(userId);
    
    const likeCount = likes.map((item) => {
        return {
          id: item.id,
          title: item.title,
          thumbnail: item.image,
          category: item.category,
          viewCount: item._count.viewsLogs,
          likeCount: item._count.likes,
          bookmarkCount: item._count.bookmarks,
          createdAt: item.createdAt,
          authour: {
            id: item.users.id,
            username: item.users.name,
            avatarUrl: item.users.avatarUrl,
          },
        };
      });

   return likeCount
 }


//서비스에 deleteLike 메서드가 없음. 
updateLike = async (projectId,  userId ) => {


let isLike = await this.likeRepository.isLike(projectId, userId);


if(!isLike) {
    await this.likeRepository.addLike(projectId, userId)
}else{
    await this.likeRepository.deleteLike(isLike.id)  //LikeId
}

    return isLike;
};


}