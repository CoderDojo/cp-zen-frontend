var BasePage = require('./base-page');

var DojoListPage = Object.create(BasePage, {
  /**
   * define elements
   */
  dojoListItems: {
    get: function () {
      return $$('.cd-dojo-list__list-item');
    }
  },
  open: {
    value: function () {
      return BasePage.open.call(this, '/dojos');
    }
  }
});

module.exports = DojoListPage;
