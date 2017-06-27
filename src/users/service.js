import Vue from 'vue';
import moment from 'moment';
import { clone } from 'lodash';
import UserUtils from '@/users/util';

const UserService = {
  register: (user, profile) => Vue.http.post(`${Vue.config.apiBase}/users/register`, {
    profile,
    user,
  }).then(() => Vue.http.post(`${Vue.config.apiBase}/users/login`, {
    email: user.email,
    password: user.password,
  })),

  getCurrentUser: () => Vue.http.get(`${Vue.config.apiBase}/users/instance`),

  addChild(profile) {
    const payload = {
      profile: clone(profile),
    };
    payload.profile.dob = moment(profile.dob).subtract(profile.dob.getTimezoneOffset(), 'm').toISOString();
    payload.profile.userTypes = [UserUtils.isUnderAge(profile.dob) ? 'attendee-u13' : 'attendee-o13'];
    payload.profile.gender = profile.otherGender ? profile.otherGender : profile.gender;
    delete payload.profile.otherGender;
    return Vue.http.post(`${Vue.config.apiBase}/profiles/youth/create`, payload);
  },
};

export default UserService;
