import UserService from '@/users/service';

export default async function (to, from, next) {
  const loggedInUser = (await UserService.getCurrentUser()).body;
  next(loggedInUser.login ? true : { name: 'Login', replace: true, query: { referer: to.fullPath } });
}
