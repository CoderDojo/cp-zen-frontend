const FindDojoPage = require('../page-objects/find-dojo-page');
const Footer = require('../page-objects/footer');

describe('i18n', () => {
  it('should change title when language is changed', () => {
    FindDojoPage.open();
    FindDojoPage.header.waitForVisible();
    expect(FindDojoPage.header.getText()).to.equal('Find a Dojo to attend');
    Footer.picker.selectByValue('de_DE');
    browser.waitUntil(() => {
      return FindDojoPage.header.getText() === 'Find a Dojo to attend, but in German';
    });
    expect(FindDojoPage.header.getText()).to.equal('Find a Dojo to attend, but in German');
    Footer.picker.selectByValue('es_ES');
    browser.waitUntil(() => {
      return FindDojoPage.header.getText() === 'Find a Dojo to attend, but in Spanish';
    });
    expect(FindDojoPage.header.getText()).to.equal('Find a Dojo to attend, but in Spanish');
    Footer.picker.selectByValue('en_US');
    browser.waitUntil(() => {
      return FindDojoPage.header.getText() === 'Find a Dojo to attend';
    });
    expect(FindDojoPage.header.getText()).to.equal('Find a Dojo to attend');
  });
});
