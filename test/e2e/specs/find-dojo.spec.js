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
    expect(DojoPage.headerReduced.getText()).to.equal('5 Dojos found near ‘CHQ’');
    expect(DojoPage.showDojoListCount.getText()).to.have.string('Showing 5 Dojos');
    const dojosListNames = DojoPage.dojoListItemNames;
    const dojosListMetas = DojoPage.dojoListItemMetas;
    expect(dojosListNames.length).to.equal(5);
    expect(dojosListNames[0].getText()).to.have.string('CD ROM');
    expect(dojosListMetas[1].getText()).to.have.string('Sunday 10am');
    expect(dojosListNames[1].getText()).to.have.string('Smithfield Awesome Dojo');
    expect(dojosListMetas[3].getText()).to.have.string('Saturdays, 5-7pm');
    expect(dojosListNames[2].getText()).to.have.string('Dublin Ninja Kids');
    expect(dojosListMetas[5].getText()).to.have.string('Third Thursday of the month, 10am - 11:30am');
    expect(dojosListNames[3].getText()).to.have.string('Super Secret Dojo');
    expect(dojosListMetas[7].getText()).to.have.string('For us to know, and you to find out.');
    expect(dojosListNames[4].getText()).to.have.string('Eventbrite Dojo');
    expect(dojosListMetas[9].getText()).to.have.string('Saturdays from 4pm to 6pm');
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

  it('should populate search results based on query in url', () => {
    DojoPage.open();
    DojoPage.addressSearchInput.waitForVisible();
    DojoPage.addressSearchInput.setValue('CHQ');
    DojoPage.addressSearchButton.click();
    DojoPage.showDojoListCount.waitForVisible();

    DojoPage.dojoListItemNames[0].click();
    browser.back();

    DojoPage.addressSearchInput.waitForVisible();
    expect(DojoPage.dojoListItemNames.length).to.equal(5);
  });

  it('should populate search results based on current location', () => {
    DojoPage.open();
    DojoPage.detectLocationButton.waitForVisible();
    DojoPage.detectLocationButton.click();
    DojoPage.showDojoListCount.waitForVisible();
    expect(DojoPage.headerReduced.getText()).to.equal('5 Dojos found near you');

    DojoPage.dojoListItemNames[0].click();
    browser.back();

    DojoPage.detectLocationButton.waitForVisible();
    expect(DojoPage.dojoListItemNames.length).to.equal(5);
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
      DojoPage.addressSearchButtonMobile.click();
      DojoPage.showDojoListCountMobile.waitForVisible();
      expect(DojoPage.headerReducedMobile.getText()).to.equal('5 Dojos found');
      expect(DojoPage.showDojoListCountMobile.getText()).to.have.string('Showing 5 Dojos');
    });

    it('should show/hide the map when clicking the toggle button', () => {
      DojoPage.addressSearchInput.waitForVisible();
      DojoPage.addressSearchInput.setValue('CHQ');
      DojoPage.addressSearchButtonMobile.click();
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
      DojoPage.addressSearchButtonMobile.click();
      DojoPage.noResultsMessageMapLink.waitForVisible();
      expect(DojoPage.map.isVisible()).to.equal(false);
      DojoPage.noResultsMessageMapLink.click();
      expect(DojoPage.map.isVisible()).to.equal(true);
      DojoPage.noResultsMessageMapLink.click();
      expect(DojoPage.map.isVisible()).to.equal(false);
    });
  });
});
