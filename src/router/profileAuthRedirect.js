export default function (to, from, next) {
  const profileAuthFlag = window.localStorage.getItem('profileAuth');

  if (profileAuthFlag === 'true') {
    const profileAuthPath = '/rpi/login';
    const params = new URLSearchParams();
    params.append('origin', window.location.pathname);
    params.append('redirect', to.fullPath);
    window.location.href = `${profileAuthPath}?${params}`;
  } else {
    next();
  }
}
