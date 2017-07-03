var path = require('path');
const BasePage = require('./base-page');

const InfoColumn = Object.create(BasePage, {
  sectionIcons: {
    get() {
      $('.cd-info-column-section__header-icon').waitForVisible();
      return $$('.cd-info-column-section__header-icon');
    },
  },
  sectionHeaders: {
    get() {
      $('.cd-info-column-section__header-text').waitForVisible();
      return $$('.cd-info-column-section__header-text');
    },
  },
  sectionContents: {
    get() {
      $('.cd-info-column-section__content').waitForVisible();
      return $$('.cd-info-column-section__content');
    },
  },
});

module.exports = InfoColumn;
