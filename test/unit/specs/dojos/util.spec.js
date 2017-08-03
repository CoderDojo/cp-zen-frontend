import DojoUtil from '@/dojos/util';

describe('Dojo Util', () => {
  describe('getDojoUrl()', () => {
    it('should return the url for a given dojo with urlSlug', () => {
      // ARRANGE
      const mockDojo = {
        urlSlug: 'foo',
      };

      // ACT AND ASSERT
      expect(DojoUtil.getDojoUrl(mockDojo)).to.equal('/dojos/foo');
    });

    it('should return the url for a given dojo with url_slug', () => {
      // ARRANGE
      const mockDojo = {
        url_slug: 'foo',
      };

      // ACT AND ASSERT
      expect(DojoUtil.getDojoUrl(mockDojo)).to.equal('/dojos/foo');
    });
  });

  describe('buildDojoFrequency()', () => {
    it('should build the string for weekly Dojos', () => {
      // ARRANGE
      const dojoMock = {
        frequency: '1/w',
        alternativeFrequency: '',
        day: 1,
        startTime: '10:30',
        endTime: '12:00',
      };

      // ACT + ASSERT
      expect(DojoUtil.buildDojoFrequency(dojoMock)).to.equal('Mondays 10:30am - 12pm, Weekly');
    });
    it('should build the string for fortnightly Dojos', () => {
      // ARRANGE
      const dojoMock = {
        frequency: '2/m',
        alternativeFrequency: '',
        day: 2,
        startTime: '10:00',
        endTime: '12:30',
      };

      // ACT + ASSERT
      expect(DojoUtil.buildDojoFrequency(dojoMock)).to.equal('Tuesdays 10am - 12:30pm, Every two weeks');
    });
    it('should build the string for monthly Dojos with no specific occurance', () => {
      // ARRANGE
      const dojoMock = {
        frequency: '1/m',
        alternativeFrequency: '',
        day: 3,
        startTime: '10:00',
        endTime: '12:00',
      };

      // ACT + ASSERT
      expect(DojoUtil.buildDojoFrequency(dojoMock)).to.equal('Wednesdays 10am - 12pm, Monthly');
    });
    it('should build the string for Dojos that occur on the first specific day of the month', () => {
      // ARRANGE
      const dojoMock = {
        frequency: '1/m',
        alternativeFrequency: 'first',
        day: 4,
        startTime: '10:00',
        endTime: '12:00',
      };

      // ACT + ASSERT
      expect(DojoUtil.buildDojoFrequency(dojoMock)).to.equal('First Thursday of the month, 10am - 12pm');
    });
    it('should build the string for Dojos that occur on the 2nd specific day of the month', () => {
      // ARRANGE
      const dojoMock = {
        frequency: '1/m',
        alternativeFrequency: '2nd',
        day: 5,
        startTime: '10:00',
        endTime: '12:00',
      };

      // ACT + ASSERT
      expect(DojoUtil.buildDojoFrequency(dojoMock)).to.equal('Second Friday of the month, 10am - 12pm');
    });
    it('should build the string for Dojos that occur on the 3rd specific day of the month', () => {
      // ARRANGE
      const dojoMock = {
        frequency: '1/m',
        alternativeFrequency: '3rd',
        day: 6,
        startTime: '10:00',
        endTime: '12:00',
      };

      // ACT + ASSERT
      expect(DojoUtil.buildDojoFrequency(dojoMock)).to.equal('Third Saturday of the month, 10am - 12pm');
    });
    it('should build the string for Dojos that occur on the 4th specific day of the month', () => {
      // ARRANGE
      const dojoMock = {
        frequency: '1/m',
        alternativeFrequency: '4th',
        day: 7,
        startTime: '10:00',
        endTime: '12:00',
      };

      // ACT + ASSERT
      expect(DojoUtil.buildDojoFrequency(dojoMock)).to.equal('Fourth Sunday of the month, 10am - 12pm');
    });
    it('should build the string for Dojos that occur on the last specific day of the month', () => {
      // ARRANGE
      const dojoMock = {
        frequency: '1/m',
        alternativeFrequency: 'last',
        day: 5,
        startTime: '10:00',
        endTime: '12:00',
      };

      // ACT + ASSERT
      expect(DojoUtil.buildDojoFrequency(dojoMock)).to.equal('Last Friday of the month, 10am - 12pm');
    });
    it('should build the string for Dojos with an "other" frequency', () => {
      // ARRANGE
      const dojoMock = {
        frequency: 'other',
        alternativeFrequency: 'Every full moon',
        day: '',
        startTime: '',
        endTime: '',
      };

      // ACT + ASSERT
      expect(DojoUtil.buildDojoFrequency(dojoMock)).to.equal('Every full moon');
    });
  });
});
