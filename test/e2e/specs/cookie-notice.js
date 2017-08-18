const FindDojoPage = require('../page-objects/find-dojo-page');
const DojoDetailsPage = require('../page-objects/dojo-details');
const Footer = require('../page-objects/footer');

describe('Cookie Notice', () => {
  beforeEach(() => {
    browser.deleteCookie('cookieDisclaimer');
  });

  it('should disappear after navigating from first page, and persist', () => {
    FindDojoPage.openWithLatLong(10, 89, false);
    expect(Footer.cookieNotice.isVisible()).to.equal(true);
    FindDojoPage.dojoListItemNames[0].click();
    DojoDetailsPage.name.waitForVisible();
    expect(Footer.cookieNotice.isVisible()).to.equal(false);
    browser.refresh();
    DojoDetailsPage.name.waitForVisible();
    expect(Footer.cookieNotice.isVisible()).to.equal(false);
  });

  it('should disappear after dismissing, and persist', () => {
    FindDojoPage.openWithLatLong(10, 89, false);
    expect(Footer.cookieNotice.isVisible()).to.equal(true);
    Footer.cookieNoticeDismissButton.click();
    expect(Footer.cookieNotice.isVisible()).to.equal(false);
    browser.refresh();
    FindDojoPage.headerReduced.waitForVisible();
    expect(Footer.cookieNotice.isVisible()).to.equal(false);
  });
});
