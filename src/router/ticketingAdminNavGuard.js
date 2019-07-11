import UserService from '@/users/service';
import UsersDojosService from '@/usersDojos/service';
import UsersDojosUtil from '@/usersDojos/util';

export default async function (to, from, next) {
  const loggedInUser = (await UserService.getCurrentUser()).body;
  if ((loggedInUser.user.roles && loggedInUser.user.roles.indexOf('cdf-admin') > -1)) {
    return next();
  }
  const usersDojos = (await UsersDojosService.getUsersDojos(
    loggedInUser.user.id,
    to.params.dojoId)).body;

  if (UsersDojosUtil.hasPermission(usersDojos, 'dojo-admin') !== undefined) {
    return next();
  }

  if (UsersDojosUtil.hasPermission(usersDojos, 'ticketing-admin') !== undefined) {
    return next();
  }
  return next({ name: 'Home' });
}
