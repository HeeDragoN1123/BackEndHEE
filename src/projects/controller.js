


export  class ProjectController {
  constructor(projectService) {
    this.projectService = projectService;
  }

  /* 프로젝트 생성 */
  createProject = async (req, res, next) => {
    try{
        const userId = req.user.id;
        const {
          title,
          description,
          image,
          liveSiteUrl,
          githubUrl,
          category,
          thumbnail,
        } = req.body;
        const project = await this.projectService.createProject(
          title,
          description,
          image,
          liveSiteUrl,
          githubUrl,
          category,
          thumbnail,
          userId
        );
    
        return res.status(201).json({ project });
    }catch(err){
        next(err);
    }

  };


  /* 프로젝트 목록 조회 */
  getProject = async (req, res, next) => {
    const project = await this.projectService.getProject();

    return res.status(200).json({ project });
  };


  /* 프로젝트 상세 조회 */
  getByIdProject = async (req, res, next) => {
    try{
        const { projectId } = req.params; 

        const project = await this.projectService.getByIdProject(projectId);
    
        return res.status(200).json({ project });
    }catch(err){
        next(err);
    }

  };


  /* 프로젝트 수정 */
  updateProject = async (req, res, next) => {
    try{
        const { projectId } = req.params;
        const  userId = req.user.id
        const { title, description, image } = req.body;
    
        const project = await this.projectService.updateProject(
          projectId,
          title,
          description,
          image,
          userId,
        );
    
        return res.status(200).json({ project });
    }catch(err){
        next(err);
    }

  };


  /* 프로젝트 삭제 */
  deleteProject = async (req, res, next) => {
    try{
        const { projectId } = req.params;
        const  userId  = req.user.id;
    
        const project = await this.projectService.deleteProject(projectId, userId);
        
        return res.status(200).json({ messege: "게시글이 삭제되었습니다." });
    }catch(err){
        next(err);
    }

  };
}


