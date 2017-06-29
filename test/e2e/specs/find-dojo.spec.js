const DojoPage = require('../page-objects/find-dojo-page');

describe('Find Dojo page', () => {
  it('should have a Get current location button', () => {
    DojoPage.open();
    browser.pause(2000);
    expect(DojoPage.detectLocationButton.isVisible()).to.equal(true);
  });

  it('should allow search by address string', () => {
    DojoPage.open();
    DojoPage.addressSearchInput.waitForVisible();
    DojoPage.addressSearchInput.setValue('CHQ');
    DojoPage.addressSearchButton.click();
    DojoPage.showDojoListCount.waitForVisible();
    expect(DojoPage.showDojoListCount.getText()).to.have.string('Showing 3 of 3 Dojos');
    const dojosList = DojoPage.dojoListItems;
    expect(dojosList.length).to.equal(3);
    expect(dojosList[0].getText()).to.have.string('CD ROM');
    expect(dojosList[1].getText()).to.have.string('Smithfield Awesome Dojo');
    expect(dojosList[2].getText()).to.have.string('Dublin Ninja Kids');
    expect(DojoPage.map.isVisible()).to.equal(true);
  });

  it('should show the no results message when there are no results', () => {
    DojoPage.open();
    DojoPage.addressSearchInput.waitForVisible();
    DojoPage.addressSearchInput.setValue('Galway');
    DojoPage.addressSearchButton.click();
    DojoPage.noResultsMessage.waitForVisible();
    expect(DojoPage.noResultsMessage.isVisible()).to.equal(true);
  });
});
