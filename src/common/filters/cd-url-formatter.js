export default (url) => {
  if (url.substring(0, 7) === 'http://' || url.substring(0, 8) === 'https://') {
    return url;
  }
  return `http://${url}`;
};
