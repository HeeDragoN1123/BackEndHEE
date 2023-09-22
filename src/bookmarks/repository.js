
import { prisma } from "../utils/prisma/index.js";

export class BookmarkRepository {
  /* 프로젝트 찾기 */
  findProjectById = async (projectId) => {
    const project = await prisma.projects.findFirst({
      where: { id: +projectId },
    });

    return project;
  };
  /* 북마크 관리 */

  isBookMarkExist = async (projectId, userId) => {
    const like = await prisma.bookmarks.findFirst({
      where: { projectId: +projectId, userId: +userId },
    });
    return like;
  };

  addBookmark = async (projectId, userId) => {
    const like = await prisma.bookmarks.create({
      data: { projectId: +projectId, userId: +userId },
    });
    return like;
  };

  deleteBookmark = async (id) => {
    const like = await prisma.bookmarks.delete({
      where: { id: +id },
    });

    return like;
  };

  getUserBookmarkedProject = async (userId) => {
    const projects = await prisma.projects.findMany({
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
    });
    console.log(projects);
    return projects;
  };
}

