import Vue from 'vue';

export default {
  getUsersDojos(userId, dojoId) {
    return Vue.http.post(`${Vue.config.apiServer}/api/2.0/dojos/users`, {
      query: {
        userId,
        dojoId,
      },
    });
  },
};
