import translationComponentGenerator from 'inject-loader!@/common/cd-translation-component-generator';

describe('Translation Component Generator', () => {
  let sandbox;
  let vueMock;
  let i18nMock;
  let translationComponentGeneratorWithMocks;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    vueMock = {
      compile: sandbox.stub(),
    };
    i18nMock = {
      t: sandbox.stub(),
    };
    translationComponentGeneratorWithMocks = translationComponentGenerator({
      vue: vueMock,
      '@/i18n': i18nMock,
    }).default;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return an component definition using the given str and interpolationOptions as a template', () => {
    // ARRANGE
    const compiledTemplateMock = {
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
      render: compiledTemplateMock.render,
      staticRenderFns: compiledTemplateMock.staticRenderFns,
    });
  });
});
