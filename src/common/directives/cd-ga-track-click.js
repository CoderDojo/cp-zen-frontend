import Vue from 'vue';
import router from '@/router/index';

export default {
  /* eslint-disable no-param-reassign */
  bind(el, binding) {
    el.dataset.gaEventCategory = router.currentRoute.name;
    el.dataset.gaEventLabel = binding.value;
    el.addEventListener('click', () => {
      const eventLabel = el.dataset.gaEventLabel;
      Vue.$ga.event({
        eventCategory: el.dataset.gaEventCategory,
        eventAction: 'click',
        eventLabel,
      });
    });
  },
  update(el, binding) {
    el.dataset.gaEventCategory = router.currentRoute.name;
    el.dataset.gaEventLabel = binding.value;
  },
  /* eslint-enable no-param-reassign */
};
