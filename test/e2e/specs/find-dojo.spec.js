const FindDojoPage = require('../page-objects/find-dojo');

describe('Find Dojo page', () => {
  it('should have a Get current location button', () => {
    FindDojoPage.open();
    expect(FindDojoPage.detectLocationButton.isVisible()).to.equal(true);
  });
});
