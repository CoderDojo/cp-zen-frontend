export default {
  getAge(dob) {
    const todayDate = new Date();
    const todayYear = todayDate.getFullYear();
    const todayMonth = todayDate.getMonth();
    const todayDay = todayDate.getDate();
    const birthYear = dob.getFullYear();
    const birthMonth = dob.getMonth() + 1;
    const birthDay = dob.getDate();
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
};
