import gaTrackClick from 'inject-loader!@/common/directives/cd-ga-track-click';

describe('GA Track Click directive', () => {
  let sandbox;
  let gaTrackClickWithMocks;
  let VueMock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    VueMock = {
      $ga: {
        event: sandbox.stub(),
      },
    };
    gaTrackClickWithMocks = gaTrackClick({
      vue: VueMock,
    }).default;
  });

  describe('bind', () => {
    it('should set value to trackingData on el dataset, and bind click event for GA tracking', () => {
      // ARRANGE
      let eventCallback;
      const el = {
        dataset: {},
        addEventListener: (event, callback) => {
          eventCallback = callback;
        },
      };
      const binding = {
        value: {
          eventCategory: 'foo',
        },
      };

      // ACT
      gaTrackClickWithMocks.bind(el, binding);

      // ASSERT
      expect(el.dataset.trackingData).to.equal(JSON.stringify(binding.value));

      // ACT
      eventCallback();

      // ASSERT
      expect(VueMock.$ga.event).to.have.been.calledOnce;
      expect(VueMock.$ga.event).to.have.been.calledWith(binding.value);
    });
  });

  describe('update', () => {
    it('should update tracking data with new binding value', () => {
      // ARRANGE
      const el = {
        dataset: {
          eventCategory: 'foo',
        },
      };
      const binding = {
        value: {
          eventCategory: 'bar',
        },
      };

      // ACT
      gaTrackClickWithMocks.update(el, binding);

      // ASSERT
      expect(el.dataset.trackingData).to.equal(JSON.stringify(binding.value));
    });
  });
});
