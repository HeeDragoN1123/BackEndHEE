
export class BookmarkRepository {
    constructor(prisma) {
      this.prisma = prisma;

    }
  
    /* 프로젝트 id  */
    findProjectById = async (projectId) => {
      const bookmark = await this.prisma.bookmarks.findFirst({
        where: { id: +projectId },
      });
  
      return bookmark;
    };
  
    /* 북마크 찾기 */
    getBookmarkById = async (userId) => {
      const bookmarks = await this.prisma.projects.findMany({
        where: {
          bookmarks: {
            some: {
              userId: +userId,
            },
          },
        },
  
        select: {
          id: true,
          title: true,
          image: true,
          category: true,
          createdAt: true,
          users: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              likes: true,
              viewsLogs: true,
              bookmarks: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return bookmarks;
    };


    /* 북마크 / 북마크 취소 */
  
    isBookmark = async (projectId, userId) => {
      const bookmark = await this.prisma.bookmarks.findFirst({
        where: { projectId: +projectId, userId: +userId },
      });
      return bookmark;
    };
  
    addBookmark = async (projectId, userId) => {
      const bookmark = await this.prisma.bookmarks.create({
        data: { projectId: +projectId, userId: +userId },
      });
      return bookmark;
    };
  
  
    deleteBookmark = async (bookmarkId) => {
      const bookmark = await this.prisma.bookmarks.delete({
        where: { id: +bookmarkId },
      });
  
      return bookmark;
    };
  
  }
  