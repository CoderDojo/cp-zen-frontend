import cdUrlFormatter from '@/common/filters/cd-url-formatter';

describe('Url formatting filter', () => {
  it('should format url to include http:// or https://', () => {
    expect(cdUrlFormatter('www.example.com')).to.equal('http://www.example.com');
    expect(cdUrlFormatter('http://www.example.com')).to.equal('http://www.example.com');
    expect(cdUrlFormatter('https://www.example.com')).to.equal('https://www.example.com');
    expect(cdUrlFormatter('http:/www.example.com')).to.equal('http://http:/www.example.com');
  });
});
