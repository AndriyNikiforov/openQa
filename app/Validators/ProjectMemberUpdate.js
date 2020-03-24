'use strict'

class ProjectMemberUpdate {
  get rules () {
    return {
      id: 'required|integer',
      user_id: 'required|integer',
      project_id: 'required|integer'
    }
  }

  get validateAll () {
    return true;
  }

  get messages () {
    return {
      'user_id.required': 'You must provide a user',
      'project_id.required': 'You must provide a project'
    };
  }

  async fails (errorMessages) {
    this.ctx.session.withErrors(errorMessages)
      .flashAll()

    return this.ctx.response.redirect('back');
  }
}

module.exports = ProjectMemberUpdate
