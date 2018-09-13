import Vue from 'vue';

export default {
  bind(el) {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const url = el.getAttribute('href');
      Vue.$ga.query('send', 'event', 'outbound', 'click', url, {
        transport: 'beacon',
        hitCallback: () => { window.location = url; },
      });
    });
  },
};
