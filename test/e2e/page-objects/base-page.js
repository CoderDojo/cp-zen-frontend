function BasePage () {}

BasePage.prototype.open = function (path) {
  return browser.url(path);
};

module.exports = new BasePage();
