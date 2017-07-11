export default {
  getDojoUrl(dojo) {
    return `/dojos/${dojo.url_slug || dojo.urlSlug}`;
  },
};
