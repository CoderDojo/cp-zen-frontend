import Vue from 'vue';
import moment from 'moment';
import { clone } from 'lodash';
import UserUtils from '@/users/util';

const UserService = {
  login: (email, password) => Vue.http.post(`${Vue.config.apiServer}/api/2.0/users/login`, {
    email,
    password,
  }),

  register: (user, profile) => Vue.http.post(`${Vue.config.apiServer}/api/2.0/users/register`, {
    profile,
    user,
  }).then(() => UserService.login(user.email, user.password)),

  getCurrentUser: () => Vue.http.get(`${Vue.config.apiServer}/api/2.0/users/instance`),

  addChild(profile) {
    const payload = {
      profile: clone(profile),
    };
    if (!(payload.profile.dob instanceof Date)) {
      payload.profile.dob = new Date(payload.profile.dob);
    }
    payload.profile.userTypes = [UserUtils.isUnderAge(payload.profile.dob) ? 'attendee-u13' : 'attendee-o13'];
    payload.profile.dob = moment(payload.profile.dob).subtract(payload.profile.dob.getTimezoneOffset(), 'm').toISOString();
    payload.profile.gender = profile.otherGender ? profile.otherGender : profile.gender;
    delete payload.profile.otherGender;
    return Vue.http.post(`${Vue.config.apiServer}/api/2.0/profiles/youth/create`, payload);
  },
};

export default UserService;
