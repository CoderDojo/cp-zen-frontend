import Vue from 'vue';

const ProjectsService = {
  list: params => Vue.http.get(`${Vue.config.projectsUrlBase}/api/v1/en/projects`, { params }),
};

export default ProjectsService;
