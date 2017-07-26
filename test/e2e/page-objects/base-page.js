function BasePage () {}

BasePage.prototype.open = function (path, clearCookie = true) {
  browser.url(path);
  // Cookie notice gets in the way, so let's dismiss it when we're not testing it
  if (clearCookie) {
    const cookieDisclaimer = browser.getCookie('cookieDisclaimer');
    if (!cookieDisclaimer || cookieDisclaimer.value !== 'confirmed') {
      $('.cd-cookie-notice__dismiss').waitForVisible();
      $('.cd-cookie-notice__dismiss').click();
    }
  }
};

module.exports = new BasePage();
