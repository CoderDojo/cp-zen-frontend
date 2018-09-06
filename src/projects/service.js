import Vue from 'vue';

const ProjectsService = {
  list: (language, params) => {
    // Note : this is a patch due to /projects non-consistent language
    const lang = language.toLowerCase() === 'en_us' ? 'en' : language.toLowerCase();
    return Vue.http.get(`${Vue.config.projectsUrlBase}/api/v1/${lang}/projects`, { params });
  },
};

export default ProjectsService;
