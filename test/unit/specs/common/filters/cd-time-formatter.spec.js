import cdTimeFormatter from '@/common/filters/cd-time-formatter';

describe('Time formatting filter', () => {
  it('should format time using 12hr utc format', () => {
    expect(cdTimeFormatter('2017-06-17T16:00:00.000Z')).to.equal('4pm');
    expect(cdTimeFormatter('2017-06-17T06:00:00.000')).to.equal('6am');
    expect(cdTimeFormatter('2017-06-17T23:45:00.000Z')).to.equal('11:45pm');
    expect(cdTimeFormatter('2017-06-17T00:30:00.000')).to.equal('12:30am');
    expect(cdTimeFormatter('2017-06-17T00:')).to.equal('Invalid date');
  });
});
