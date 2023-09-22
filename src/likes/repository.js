
export class LikeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  /* 프로젝트 id  */
  findProjectById = async (projectId) => {
    const project = await this.prisma.projects.findFirst({
      where: { id: +projectId },
    });

    return project;
  };

  /* 좋아요 찾기 */
  getLikeById = async (userId) => {
    const project = await this.prisma.projects.findMany({
      where: {
        likes: {
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
    return project;
  };

  /* 좋아요 관리 */

  isLikeExist = async (projectId, userId) => {
    const like = await this.prisma.likes.findFirst({
      where: { projectId: +projectId, userId: +userId },
    });
    return like;
  };

  addLike = async (projectId, userId) => {
    const like = await this.prisma.likes.create({
      data: { projectId: +projectId, userId: +userId },
    });
    return like;
  };


  deleteLike = async (id) => {
    const like = await this.prisma.likes.delete({
      where: { id: +id },
    });

    return like;
  };
}
