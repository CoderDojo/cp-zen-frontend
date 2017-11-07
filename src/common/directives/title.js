import i18n from '@/i18n';

function setTitle(el, binding) {
  if (binding.value) {
    document.title = `${binding.value} – ${i18n.t('CoderDojo Community Platform')}`;
  } else {
    document.title = i18n.t('CoderDojo Community Platform');
  }
}

export default {
  inserted: setTitle,
  update: setTitle,
};
