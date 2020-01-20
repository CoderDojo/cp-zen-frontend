import Vue from 'vue';

function notifyError(error) {
  Vue.toasted.show(error, {
    duration: 10000,
    type: 'error',
    keepOnHover: true,
    action: {
      text: 'X',
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      },
    },
  });
}

export default function errorDisplayGuard(to, from, next) {
  const { error, ...queryWithoutError } = to.query;
  if (error) {
    notifyError(error);
    next({ ...to, query: queryWithoutError || {} });
  } else {
    next();
  }
}
