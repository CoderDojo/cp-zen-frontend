import Vue from 'vue';

export default {
  /* eslint-disable no-param-reassign */
  bind(el, binding) {
    el.dataset.trackingData = JSON.stringify(binding.value);
    el.addEventListener('click', () => {
      const trackingData = JSON.parse(el.dataset.trackingData);
      Vue.$ga.event(trackingData);
    });
  },
  update(el, binding) {
    el.dataset.trackingData = JSON.stringify(binding.value);
  },
  /* eslint-enable no-param-reassign */
};
