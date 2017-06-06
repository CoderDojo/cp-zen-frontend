import cdDojoPrivate from '@/dojos/filters/cd-dojo-private';

describe('Dojo private filter', () => {
  it('should convert private flag', () => {
    expect(cdDojoPrivate(1)).to.be.equal('Private');
    expect(cdDojoPrivate(0)).to.be.equal('Public');
  });
});
