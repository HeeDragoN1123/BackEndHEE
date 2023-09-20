import { CustomError } from "../errors/customError.js";console

export class ProjectService {


  constructor(projectRepository) {
    this.projectRepository = projectRepository;
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
    const project = await this.projectRepository.createProject(
      title,
      description,
      image,
      liveSiteUrl,
      githubUrl,
      category,
      userId
    );
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      liveSiteUrl: project.liveSiteUrl,
      githubUrl: project.githubUrl,
      category: project.category,
      createdAt: project.createdAt,
    };
  };

  /* 프로젝트 목록 조회 */
  getProject = async () => {
    const projects = await this.projectRepository.getProject();

    const project = projects.map((item) => {
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
    return project;
  };

  /* 프로젝트 상세 조회 */
  getProjectById = async (projectId) => {
    const project = await this.projectRepository.getProjectById(projectId);
    if (!project) throw new CustomError(404, "게시글이 존재하지 않습니다");

    return {
      id: project.id,
      title: project.title,
      thumbnail: project.image,
      category: project.category,
      viewCount: project._count.viewsLogs,
      likeCount: project._count.likes,
      bookmarkCount: item._count.bookmarks,
      createdAt: project.createdAt,
      authour: {
        id: project.users.id,
        username: project.users.name,
        avatarUrl: project.users.avatarUrl,
      },
    };
  };

  /* 프로젝트 수정 */
  updateProject = async (projectId, title, description, image, userId) => {
    const project = await this.projectRepository.findProject(projectId);

    if (!project) {
      throw new CustomError(404, "게시글이 존재하지 않습니다.");
    }
    return await this.projectRepository.updateProject(projectId,title, title, description, image);
  };


  /* 프로젝트 삭제 */
  deleteProject = async (projectId, userId) => {
    const project = await this.projectRepository.findProject(projectId);

    if (!project) {
      throw new CustomError(404, "게시글이 존재하지 않습니다.");
    }
    if (project.userId !== userId) {
      throw new CustomError(403, "게시글 삭제 권한이 없습니다");
    }
    return await this.projectRepository.deleteProject(projectId);
  };

  getProjectByCategory = async (category) => {
    const projects = await this.projectRepository.getProjectByCategory(
      category
    );
    if (!projects)
      throw new CustomError(404, "카테고리에 해당하는 게시글이 없습니다");

    const project = projects.map((item) => {
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

    return project;
  };
}


