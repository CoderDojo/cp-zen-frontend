export default {
  isUnderAge(birthDay, birthMonth, birthYear) {
    const todayDate = new Date();
    const todayYear = todayDate.getFullYear();
    const todayMonth = todayDate.getMonth();
    const todayDay = todayDate.getDate();
    let age = todayYear - birthYear;

    if (todayMonth < birthMonth - 1) {
      age -= 1;
    }

    if (birthMonth - 1 === todayMonth && todayDay < birthDay) {
      age -= 1;
    }
    return age < 13;
  },
};
