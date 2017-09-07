const FindDojoPage = require('../page-objects/find-dojo-page');
const Footer = require('../page-objects/footer');
const DojoDetailsPage = require('../page-objects/dojo-details');

describe('i18n', () => {
  it('should change title when language is changed', () => {
    FindDojoPage.open();
    FindDojoPage.header.waitForVisible();
    expect(FindDojoPage.header.getText()).to.equal('Find a Dojo to attend');
    Footer.languagePicker.selectByValue('de_DE');
    browser.waitUntil(() => {
      return FindDojoPage.header.getText() === 'Find a Dojo to attend, but in German';
    });
    expect(FindDojoPage.header.getText()).to.equal('Find a Dojo to attend, but in German');
    Footer.languagePicker.selectByValue('es_ES');
    browser.waitUntil(() => {
      return FindDojoPage.header.getText() === 'Find a Dojo to attend, but in Spanish';
    });
    expect(FindDojoPage.header.getText()).to.equal('Find a Dojo to attend, but in Spanish');
    Footer.languagePicker.selectByValue('en_US');
    browser.waitUntil(() => {
      return FindDojoPage.header.getText() === 'Find a Dojo to attend';
    });
    expect(FindDojoPage.header.getText()).to.equal('Find a Dojo to attend');
  });

  it('should change date strings when the language is changed', () => {
    FindDojoPage.openDojoWithQuery('dublin');
    DojoDetailsPage.name.waitForVisible();
    Footer.languagePicker.selectByValue('pt_PT');
    browser.waitUntil(() => {
      return DojoDetailsPage.eventDate(0).getText() === 'Dezembro 6, 2017';
    });
    expect(DojoDetailsPage.eventDate(0).getText()).to.equal('Dezembro 6, 2017');
    Footer.languagePicker.selectByValue('es_ES');
    browser.waitUntil(() => {
      return DojoDetailsPage.eventDate(0).getText() === 'diciembre 6, 2017';
    });
    expect(DojoDetailsPage.eventDate(0).getText()).to.equal('diciembre 6, 2017');
    Footer.languagePicker.selectByValue('en_US');
    browser.waitUntil(() => {
      return DojoDetailsPage.eventDate(0).getText() === 'December 6, 2017';
    });
    expect(DojoDetailsPage.eventDate(0).getText()).to.equal('December 6, 2017');
  });
});
