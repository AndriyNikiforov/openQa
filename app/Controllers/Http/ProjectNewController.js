'use strict'

const Database = use('Database');
const ProjectComment = use('App/Models/ProjectComment');

class ProjectNewController {
  async index({ params, view }) {
    const { id } = params;
    const viewData = await Database
      .select(
        'projects.id',
        'projects.title',
        'project_comments.id as pc_id',
        'project_comments.text',
        'users.full_name',
        'users.email'
      )
      .where('project_comments.project_id', id)
      .from('project_comments')
      .leftJoin('projects', 'project_comments.project_id', 'projects.id')
      .leftJoin('users', 'users.id', 'project_comments.user_id');

    return view.render('project_new.index', {
      project_id: id,
      projectComments: viewData
    });
  }

  async createPage({ params, view }) {
    const { project_id } = params;
    return view.render('project_new.create', {
      project_id: project_id
    });
  }

  async store({ request, response }) {
    const data = request.only([
      'text',
      'project_id',
      'user_id'
    ]);
    const projectComment = new ProjectComment();

    projectComment.fill(data);
    await projectComment.save();

    return response.route('project-news', {
      id: projectComment.project_id
    });
  }

  async remove({ params, response }) {
    const { id } = params;
    const projectComment = await ProjectComment.find(id);
    const project_id = projectComment.project_id;

    await projectComment.delete();

    return response.route('project-news', { id: project_id });
  }
}

module.exports = ProjectNewController