import prisma from "prisma";

export class BookmarkRepository {
    /* 프로젝트 찾기 */
  findProjectById = async (projectId) => {
    const project = await this.prisma.projects.findFirst({
      where: { id: +projectId },
    });

    return project;
  };
  /* 북마크 관리 */

  isBookMarkExist = async (projectId, userId) => {
    const like = await this.prisma.likes.findFirst({
      where: { projectId: +projectId, userId: +userId },
    });
    return like;
  };

  addBookmark = async (projectId, userId) => {
    const like = await this.prisma.bookmarks.create({
      data: { projectId: +projectId, userId: +userId },
    });
    return like;
  };

  deleteBookmark = async (id) => {
    const like = await this.prisma.bookmarks.delete({
      where: { id: +id },
    });

    return like;
  };
}
