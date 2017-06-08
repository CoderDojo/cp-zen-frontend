export default {
  bind(el, binding) {
    /* eslint-disable no-param-reassign */
    function errorHandler() {
      const stringArray = (binding.value.fallback).split('/');
      const fallbackImageName = stringArray[stringArray.length - 1];
      if (!el.src.endsWith(fallbackImageName)) {
        el.src = binding.value.fallback;
      }
    }
    function loadHandler() {
      el.style.visibility = 'visible';
    }
    el.style.visibility = 'hidden';
    el.addEventListener('error', errorHandler);
    el.addEventListener('load', loadHandler);
    el.src = binding.value.src;
  },
};
