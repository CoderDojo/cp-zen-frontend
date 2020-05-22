import UserService from '@/users/service';

const fn = {
  redirect(user, from, next) {
    if (user && user.login) {
      return next();
    }
    const rpiAuthFlag = window.localStorage.getItem('rpiAuth') === 'true';
    return window.location.replace(`/${rpiAuthFlag ? 'rpi' : 'cdf'}/login?referer=${from}`);
  },
};
export default async function (to, from, next) {
  let loggedInUser = {};
  try {
    loggedInUser = (await UserService.getCurrentCDFUser()).body;
  } catch (e) {
    fn.redirect(null, to.fullPath, next);
  }
  fn.redirect(loggedInUser, to.fullPath, next);
};
export { fn };
