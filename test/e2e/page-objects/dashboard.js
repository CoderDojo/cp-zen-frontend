const BasePage = require('./base-page');

const DashboardPage = Object.create(BasePage, {
  header: {
    get() {
      return $('.cd-dashboard-events__header');
    },
  },
  open: {
    value(clearCookie) {
      return BasePage.open.call(this, '/home', clearCookie);
    },
  },
});

module.exports = DashboardPage;
