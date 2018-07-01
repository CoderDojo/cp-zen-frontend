import cdHTMLFilter from '@/common/filters/cd-html-filter';

describe('Filter HTML content', () => {
  it('shoud only allow simple formatting tags', () => {
    const accepted = ['b', 'p', 'br', 'ul', 'li'];
    const testString = '<p>paragraph</p><br /><ul><li>listitem</li></ul>';
    expect(cdHTMLFilter(testString, { allowedTags: accepted })).to.equal(testString);
  });

  it('shoud remove unallowed tags', () => {
    const accepted = ['b', 'p', 'br', 'ul', 'li'];
    const testString = '<dt><dd>uho</dd></dt>';
    expect(cdHTMLFilter(testString, { allowedTags: accepted })).to.equal('uho');
  });
});
