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
    expect(DojoPage.showDojoListCount.getText()).to.have.string('Showing 4 Dojos');
    const dojosList = DojoPage.dojoListItems;
    expect(dojosList.length).to.equal(4);
    expect(dojosList[0].getText()).to.have.string('CD ROM');
    expect(dojosList[1].getText()).to.have.string('Smithfield Awesome Dojo');
    expect(dojosList[2].getText()).to.have.string('Dublin Ninja Kids');
    expect(dojosList[3].getText()).to.have.string('Super Secret Dojo');
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

  describe('Mobile specific tests', () => {
    beforeEach(() => {
      DojoPage.open();
      browser.setViewportSize({
        width: 320,
        height: 586,
      }); // iPhone 5 (smallest screen)
    });

    it('should still show the dojo list count', () => {
      DojoPage.addressSearchInput.waitForVisible();
      DojoPage.addressSearchInput.setValue('CHQ');
      DojoPage.addressSearchButton.click();
      DojoPage.showDojoListCountMobile.waitForVisible();
      expect(DojoPage.showDojoListCountMobile.getText()).to.have.string('Showing 4 Dojos');
    });

    it('should show/hide the map when clicking the toggle button', () => {
      DojoPage.addressSearchInput.waitForVisible();
      DojoPage.addressSearchInput.setValue('CHQ');
      DojoPage.addressSearchButton.click();
      DojoPage.toggleMap.waitForVisible();
      expect(DojoPage.map.isVisible()).to.equal(false);
      expect(DojoPage.toggleMap.getText()).to.have.string('Show Map');
      DojoPage.toggleMap.click();
      expect(DojoPage.map.isVisible()).to.equal(true);
      expect(DojoPage.toggleMap.getText()).to.have.string('Hide Map');
      DojoPage.toggleMap.click();
      expect(DojoPage.map.isVisible()).to.equal(false);
      expect(DojoPage.toggleMap.getText()).to.have.string('Show Map');
    });

    it('should show/hide the map when clicking the inline message toggle', () => {
      DojoPage.addressSearchInput.waitForVisible();
      DojoPage.addressSearchInput.setValue('Galway');
      DojoPage.addressSearchButton.click();
      DojoPage.noResultsMessageMapLink.waitForVisible();
      expect(DojoPage.map.isVisible()).to.equal(false);
      DojoPage.noResultsMessageMapLink.click();
      expect(DojoPage.map.isVisible()).to.equal(true);
      DojoPage.noResultsMessageMapLink.click();
      expect(DojoPage.map.isVisible()).to.equal(false);
    });
  });
});
