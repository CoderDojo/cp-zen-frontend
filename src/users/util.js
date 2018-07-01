import { cloneDeep } from 'lodash';
import moment from 'moment';

export default {
  getAge(dob) {
    let _dob = dob;
    if (!(_dob instanceof Date)) {
      _dob = new Date(_dob);
    }
    const todayDate = new Date();
    const todayYear = todayDate.getFullYear();
    const todayMonth = todayDate.getMonth();
    const todayDay = todayDate.getDate();
    const birthYear = _dob.getFullYear();
    const birthMonth = _dob.getMonth() + 1;
    const birthDay = _dob.getDate();
    let age = todayYear - birthYear;

    if (todayMonth < birthMonth - 1) {
      age -= 1;
    }

    if (birthMonth - 1 === todayMonth && todayDay < birthDay) {
      age -= 1;
    }
    return age;
  },
  isUnderAge(dob) {
    const age = this.getAge(dob);
    return age < 13;
  },
  isYouthOverThirteen(dob) {
    const age = this.getAge(dob);
    return age > 12 && age < 18;
  },
  isYouthUnderEighteen(dob) {
    if (dob) {
      const age = this.getAge(dob);
      return age < 18;
    }
    return null;
  },
  profileToJSON(profile) {
    const profileClone = cloneDeep(profile);
    if (!(profileClone.dob instanceof Date)) {
      profileClone.dob = new Date(profileClone.dob);
    }
    profileClone.dob = moment(profileClone.dob).subtract(profileClone.dob.getTimezoneOffset(), 'm').toISOString();
    return profileClone;
  },
};
