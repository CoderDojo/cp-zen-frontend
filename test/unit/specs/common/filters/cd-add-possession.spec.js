import addPossession from '@/common/filters/cd-add-possession';

describe('Url formatting filter', () => {
  it('should add possesion if a first name is provided', async () => {
    expect(addPossession('Jane')).to.equal(' – Jane');
  });
  it('should not possesion if a first name is not provided', async () => {
    expect(addPossession('')).to.equal('');
  });
});
