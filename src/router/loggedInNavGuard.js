import UserService from '@/users/service';

export default async function (to, from, next) {
  const loggedInUser = (await UserService.getCurrentUser()).body;
  if (loggedInUser.login === null) {
    next({ name: 'Login', query: { referer: to.fullPath } });
    return null;
  }

  if (
    loggedInUser.user &&
    loggedInUser.user.termsConditionsAccepted === false
  ) {
    next({ path: `/dashboard/profile/${loggedInUser.user.id}/edit` });
    return null;
  }

  next(undefined);
  return null;
}
