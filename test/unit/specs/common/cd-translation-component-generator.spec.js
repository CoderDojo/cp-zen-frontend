import translationComponentGenerator from 'inject-loader!@/common/cd-translation-component-generator';

describe('Translation Component Generator', () => {
  let vueMock;
  let i18nMock;
  let translationComponentGeneratorWithMocks;

  beforeEach(() => {
    vueMock = {
      compile: sinon.stub(),
    };
    i18nMock = {
      t: sinon.stub(),
    };
    translationComponentGeneratorWithMocks = translationComponentGenerator({
      vue: vueMock,
      '@/i18n': i18nMock,
    }).default;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return an component definition using the given str and interpolationOptions as a template', () => {
    // ARRANGE
    const compiledTemplateMock = {
      props: ['props'],
      render: 'render',
      staticRenderFns: 'staticRenderFns',
    };
    const str = 'str';
    const interpolationOptions = 'interpolationOptions';
    vueMock.compile.withArgs('<span>foo</span>').returns(compiledTemplateMock);
    i18nMock.t.withArgs(str, interpolationOptions).returns('foo');

    // ACT
    const component = translationComponentGeneratorWithMocks(str, interpolationOptions);

    // ASSERT
    expect(component).to.deep.equal({
      name: 'Translation',
      props: compiledTemplateMock.props,
      render: compiledTemplateMock.render,
      staticRenderFns: compiledTemplateMock.staticRenderFns,
    });
  });
});
