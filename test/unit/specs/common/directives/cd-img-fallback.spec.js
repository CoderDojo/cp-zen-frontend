import ImageFallback from '@/common/directives/cd-img-fallback';

describe('Image fallback', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should set the src to fallback on error', () => {
    // ARRANGE
    const bindingMock = {
      value: {
        src: 'https://s3-eu-west-1.amazonaws.com/zen-dojo-images/foo.png',
        fallback: '../assets/avatars/bar.png',
      },
    };
    const elMock = {
      addEventListener: sinon.stub(),
      style: {},
    };
    let errorCb = () => {};
    let loadCb = () => {};
    elMock.addEventListener.withArgs('error').callsFake((eventName, cb) => {
      errorCb = cb;
    });
    elMock.addEventListener.withArgs('load').callsFake((eventName, cb) => {
      loadCb = cb;
    });

    // ACT
    ImageFallback.bind(elMock, bindingMock);

    // ASSERT
    expect(elMock.style.visibility).to.equal('hidden');
    expect(elMock.src).to.equal(bindingMock.value.src);
    errorCb();
    expect(elMock.src).to.equal(bindingMock.value.fallback);
    loadCb();
    expect(elMock.style.visibility).to.equal('visible');
  });

  it('should only try set fallback src once', () => {
    // ARRANGE
    const bindingMock = {
      value: {
        src: 'https://s3-eu-west-1.amazonaws.com/zen-dojo-images/foo.png',
        fallback: '../assets/avatars/bar.png',
      },
    };
    let srcSetCallCount = 0;
    let srcValue;
    const elMock = {
      addEventListener: sinon.stub(),
      style: {},
      get src() {
        return srcValue;
      },
      set src(val) {
        srcSetCallCount += 1;
        srcValue = val;
      },
    };

    let errorCb = () => {};
    elMock.addEventListener.withArgs('error').callsFake((eventName, cb) => {
      errorCb = cb;
    });

    // ACT
    ImageFallback.bind(elMock, bindingMock);

    // ASSERT
    expect(srcSetCallCount).to.equal(1);
    errorCb();
    expect(srcSetCallCount).to.equal(2);
    expect(elMock.src).to.equal(bindingMock.value.fallback);
    errorCb();
    expect(srcSetCallCount).to.equal(2);
    expect(elMock.src).to.equal(bindingMock.value.fallback);
  });
});
