
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

      return res.status(201).json(project);
    } catch (err) {
      next(err);
    }
  };

  /* 프로젝트 목록 조회 */
  getProject = async (req, res, next) => {
    try {
      const projects = await this.projectService.getProject();

      return res.status(200).json(projects);
    } catch (err) {
      next(err);
    }
  };

  /* 프로젝트 상세 조회 */
  getProjectById = async (req, res, next) => {
    try {
      const { projectId } = req.params;

      const project = await this.projectService.getProjectById(projectId);

      return res.status(200).json(project);
    } catch (err) {
      next(err);
    }
  };

  /* 프로젝트 수정 */
  updateProject = async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const  userId = req.user.id
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
      const  userId  = req.user.id;
      const project = await this.projectService.deleteProject(
        projectId,
        userId
      );
      return res.status(200).json({ project });
    } catch (err) {
      next(err);
    }
  };

  /* 카테고리별 조회 */
  getProjectByCategory = async (req, res, next) => {
    try {
      const { category } = req.query;
      
      const project = await this.projectService.getProjectByCategory(category);

      return res.status(200).json(project);
    } catch (err) {
      next(err);
    }
  };

/* 페이지네이션 */
getProjectPage = async(req,res,next) => {
  
  const page = parseInt(req.query.page) || 1; // 현재 페이지
  const perPage = parseInt(req.query.perPage) || 20; // 페이지당 항목 수

  // 데이터베이스에서 게시글 전체목록 가져오기 
  const totalProjectsCount = await this.projectService.getProject();
  
  // 현재 페이지에 표시할 게시글만 추출
  const paginatedProjects = await this.projectService.getProjectPage(page, perPage);
  
  /* http 응답 헤더에 데이터 추가 */
  res.setHeader('total', totalProjectsCount.length);
  res.setHeader('page', page);
  res.setHeader('perPage', perPage);

 return res.status(200).json({
    // total: totalProjectsCount.length, // 전체 게시글 숫자
    // page: page,
    // perPage: perPage,
    data: paginatedProjects,
  });
  
}

}
