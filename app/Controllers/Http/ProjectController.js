'use strict'

const dayjs = require('dayjs');
const Project = use('App/Models/Project');
const Database = use('Database');

class ProjectController {
  async index({ params, view, response }) {
    let { id, page } = params;
    page = page || 1;

    const projectData = await Project.find(id);
    projectData.created_at = dayjs(projectData.created_at)
      .format('YYYY-DD-MM');

    const testCasesData = await Database
      .select(
        'users.full_name',
        'statuses.name as status_name',
        'statuses.type as status_type',
        'test_cases.title as test_case_name',
      ).from('test_cases')
      .where('test_cases.project_id', id)
      .leftJoin('users', 'test_cases.user_id', 'users.id')
      .leftJoin('statuses', 'test_cases.status_id', 'statuses.id')
      .paginate(page, 8)

    return view.render('project.index', {
      project: projectData,
      testCases: testCasesData
    });
  }

  async createPage({ view, auth }) {
    const userData = auth.getUser();

    return view.render('project.create', { user: userData });
  }

  async editPage({ params, view, response }) {
    const { id } = params;
    const projectData = await Project.find(id);
    projectData.created_at = dayjs(projectData.created_at)
    .format('YYYY-DD-MM');

    return view.render('project.edit', {
      project: projectData
    });
  }

  async store({ request, response, auth }) {
    const data = request.only([
      'title',
      'description',
      'technical_info',
    ]);

    data.user_id = auth.getUser().id;
    const project = await Project.create(data);

    return response.route('project', { id: project.id });
  }

  async update({ request, response, auth }) {
    const data = request.only([
      'id',
      'title',
      'description',
      'technical_info'
    ]);

    data.user_id = auth.getUser().id;
    await Project.query()
      .where('id', data.id)
      .update(data);

    return response.route('project', { id: data.id });
  }

  async delete({ params, response }) {
    const { id } = params;

    await Project
      .query()
      .where('id', id)
      .delete();

    return response.route('dashboard');
  }
}

module.exports = ProjectController