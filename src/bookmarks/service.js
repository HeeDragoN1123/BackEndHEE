

export class BookmarkService{
    constructor(bookmarkRepository){
        this.bookmarkRepository = bookmarkRepository
        }

 
/* 북마크한 프로젝트 id 찾기 */
findProjectById = async (projectId) =>{
    const bookmark = await this.bookmarkRepository.findProjectById(projectId);
    
    return bookmark


}

/* 북마크한 유저 id 찾기 */
getBookmarkById = async (userId) => {
    const bookmarks = await this.bookmarkRepository.getBookmarkById(userId);
    const bookmarkCount = bookmarks.map((item) => {
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

    return bookmarkCount

 }


/* 북마크 추가 / 취소  */
updateBookmark = async (projectId , userId ) => {


let isBookmark = await this.bookmarkRepository.isBookmark(projectId, userId);


if(!isBookmark) {
    await this.bookmarkRepository.addBookmark(projectId, userId)
}else{
    await this.bookmarkRepository.deleteBookmark(isBookmark.id)
}

    return isBookmark;
};

}