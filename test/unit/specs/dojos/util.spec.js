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
});
