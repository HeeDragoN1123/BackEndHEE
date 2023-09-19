export class ProjectController {
  constructor(projectService) {
    this.projectService = projectService;
  }

  /* 프로젝트 생성 */
  createProject = async (req, res, next) => {
    try {
      const { title, description, image, liveSiteUrl, githubUrl, category } =
        req.body;
      const userId = req.user.id;

      const project = await this.projectService.createProject(
        title,
        description,
        image,
        liveSiteUrl,
        githubUrl,
        category,
        userId
      );

      return res.status(201).json({ project });
    } catch (err) {
      next(err);
    }
  };

  /* 프로젝트 목록 조회 */
  getProject = async (req, res, next) => {
    try {
      const project = await this.projectService.getProject();

      return res.status(200).json({ project });
    } catch (err) {
      next(err);
    }
  };

  /* 프로젝트 상세 조회 */
  getByIdProject = async (req, res, next) => {
    try {
      const { projectId } = req.params;

      const project = await this.projectService.getByIdProject(projectId);

      return res.status(200).json({ project });
    } catch (err) {
      next(err);
    }
  };

  /* 프로젝트 수정 */
  updateProject = async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const { title, description, image } = req.body;

      const project = await this.projectService.updateProject(
        projectId,
        title,
        description,
        image,
        userId
      );

      return res.status(200).json({ project });
    } catch (err) {
      next(err);
    }
  };

  /* 프로젝트 삭제 */
  deleteProject = async (req, res, next) => {
    try {
      const { projectId } = req.params;

      const project = await this.projectService.deleteProject(
        projectId,
        userId
      );
      return res.status(200).json({ project });
    } catch (err) {
      next(err);
    }
  };
}
