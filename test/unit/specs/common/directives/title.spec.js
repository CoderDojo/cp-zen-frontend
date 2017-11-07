import title from 'inject-loader!@/common/directives/title';

describe('Title Directive', () => {
  let titleWithMock;

  beforeEach(() => {
    const i18nMock = {
      t(str) {
        return `translate(${str})`;
      },
    };
    titleWithMock = title({
      '@/i18n': i18nMock,
    }).default;
  });

  describe('inserted', () => {
    it('should set document.title with given value if exists', () => {
      // ACT
      titleWithMock.inserted({}, { value: 'Some title' });

      // ASSERT
      expect(document.title).to.equal('Some title – translate(CoderDojo Community Platform)');
    });

    it('should set document.title to a default if no value given', () => {
      // ACT
      titleWithMock.inserted({}, {});

      // ASSERT
      expect(document.title).to.equal('translate(CoderDojo Community Platform)');
    });
  });

  describe('update', () => {
    it('should be bound to the same function as inserted', () => {
      expect(titleWithMock.inserted).to.equal(titleWithMock.update);
    });
  });
});
