import UserService from '@/users/service';

export default async function (to, from, next) {
  const loggedInUser = (await UserService.getCurrentUser()).body;
  next(loggedInUser.login ? undefined : { name: 'Login', query: { referer: to.fullPath } });
}
