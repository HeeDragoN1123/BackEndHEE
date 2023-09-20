

export class BookmarkService{
    constructor(bookmarkRepository){
        this.bookmarkRepository = bookmarkRepository
        }

 
/* 북마크한 프로젝트 id 찾기 */
findProjectById = async (projectId) =>{
    const bookmarkCount = await this.bookmarkRepository.findProjectById(projectId);
    
    return bookmarkCount
}

/* 북마크한 유저 id 찾기 */
getBookmarkById = async (userId) => {
    const bookmarkCount = await this.bookmarkRepository.getBookmarkById(userId);

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