const DojoPage = require('../page-objects/find-dojo-page');

describe('The dojo list', () => {
  it('should list all the dojos', () => {
    DojoPage.openWithLatLong(10, 89);
    const dojosList = DojoPage.dojoListItemNames;
    const dojoListImages = DojoPage.dojoListItemImages;
    expect(dojosList.length).to.equal(5);
    expect(dojosList[0].getText()).to.have.string('CD ROM');
    expect(dojosList[0].getText()).to.have.string('Private');
    expect(dojoListImages[0].getAttribute('src')).not.to.have.string('dojo-default-logo.');
    expect(dojosList[1].getText()).to.have.string('Smithfield Awesome Dojo');
    expect(dojosList[1].getText()).to.have.string('Public');
    expect(dojoListImages[1].getAttribute('src')).to.have.string('dojo-default-logo.');
    expect(dojosList[2].getText()).to.have.string('Dublin Ninja Kids');
    expect(dojosList[2].getText()).to.have.string('Public');
    expect(dojoListImages[2].getAttribute('src')).to.have.string('dojo-default-logo.');
    expect(dojosList[3].getText()).to.have.string('Super Secret Dojo');
    expect(dojosList[3].getText()).to.have.string('Private');
    expect(dojoListImages[3].getAttribute('src')).to.have.string('dojo-default-logo.');
  });
});
