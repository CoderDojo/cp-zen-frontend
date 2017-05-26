const DojoPage = require('../page-objects/dojo-page');

describe('Find Dojo page', () => {
  it('should have a Get current location button', () => {
    DojoPage.open();
    expect(DojoPage.detectLocationButton.isVisible()).to.equal(true);
  });
});
