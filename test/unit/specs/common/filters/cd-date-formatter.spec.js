import cdDateFormatter from '@/common/filters/cd-date-formatter';

describe('Date formatting filter', () => {
  it('should format dates correctly', () => {
    expect(cdDateFormatter('2017-06-17T16:00:00.000Z')).to.equal('June 17, 2017');
    expect(cdDateFormatter('1970-01-01T16:00:00.000Z')).to.equal('January 1, 1970');
    expect(cdDateFormatter('2020-08-22T16:00:00.000Z')).to.equal('August 22, 2020');
    expect(cdDateFormatter('1996-11-22T16:00:00.000Z')).to.equal('November 22, 1996');
    expect(cdDateFormatter('T16:00:00.000Z')).to.equal('Invalid date');
  });
});
