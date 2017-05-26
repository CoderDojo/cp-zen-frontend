const DojoPage = require('../page-objects/find-dojo');

describe('Find Dojo page', () => {
  it('should have a Get current location button', () => {
    DojoPage.open();
    expect(DojoPage.detectLocationButton.isVisible()).to.equal(true);
  });
});
