export default {
  save(key, data) {
    window.sessionStorage.setItem(key, JSON.stringify(data));
  },
  load(key) {
    const dataString = window.sessionStorage.getItem(key);
    return JSON.parse(dataString);
  },
  delete(key) {
    window.sessionStorage.removeItem(key);
  },
};
