
export class ProjectRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  /* 프로젝트 생성 */
  createProject = async (
    title,
    description,
    image,
    liveSiteUrl,
    githubUrl,
    category,
    userId
  ) => {
    const project = await this.prisma.projects.create({
      data: {
        title,
        description,
        image,
        liveSiteUrl,
        githubUrl,
        category,
        userId,
      },
    });
    return project;
  };

  /* 프로젝트 목록 조회 */

  getProject = async () => {
    const projects = await this.prisma.projects.findMany({
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
        likes: {
          select: {
            userId: userId
          }
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
    return projects;
  };

  /* 프로젝트 상세 조회 */
  getProjectById = async (projectId) => {
    const project = await this.prisma.projects.findFirst({
      where: { id: +projectId },
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
    return project
  };

  /* 프로젝트id 조회 */
  findProject = async (projectId) => {
    
    const project = await this.prisma.projects.findUnique({
      where: {
        id: +projectId,
      },
    });
    
    return project;
  };

  updateProject = async (projectId, title, description, image) => {
    const project = await this.prisma.projects.update({
      where: {
        id: +projectId,
      },
      data: {
        title,
        description,
        image,
      },
    });
    return project;
  };

  /* 프로젝트 삭제 */
  deleteProject = async (projectId, title, description, image) => {
    return await this.prisma.projects.delete({

      where: {
        id: +projectId,
      },

    });
  };

  getProjectByCategory = async (category) => {
    const project = await this.prisma.projects.findMany({
      where: { category },
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

    return project;
  };
}
