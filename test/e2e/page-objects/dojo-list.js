const BasePage = require('./base-page');

const DojoListPage = Object.create(BasePage, {
  /**
   * define elements
   */
  dojoListItems: {
    get() {
      return $$('.cd-dojo-list__list-item');
    },
  },
  open: {
    value() {
      return BasePage.open.call(this, '/dojos');
    },
  },
});

module.exports = DojoListPage;
