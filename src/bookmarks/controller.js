
export class BookmarkController {
    constructor(bookmarkService) {
      this.bookmarkService = bookmarkService;
    }
  
   
  
    /* 북마크 조회 */
    getBookmark = async (req, res, next) => {
      const { projectId } = req.params;
      const userId = req.user.id;
     
      await this.bookmarkService.findProjectById(projectId);
      const bookmarkCount = await this.bookmarkService.getBookmarkById(userId);
      
      return res.status(200).json({ bookmarkCount });
    };
  
  
    /* 북마크 업데이트 */
  
    updateBookmark = async (req, res, next) => {
      const { projectId } = req.params;
      const userId = req.user.id;
  
      await this.bookmarkService.findProjectById(projectId);
      let isBookmark = await this.bookmarkService.updateBookmark(projectId, userId);
      
      if (isBookmark) {
        if (userId !== isBookmark.UserId) {
          return res.status(200).json({ message: "북마크가 취소되었습니다" });
        }
      } else {
        return res.status(200).json({ message: `${projectId}번 게시글 북마크+1` });
      }
      return res.status(200).json({ message: `${projectId}번 게시글 북마크+1` });
  
  
    };
  }
  