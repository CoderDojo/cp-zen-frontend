import Vue from 'vue';
import VueI18n from 'vue-i18n';
import messagesEnUs from 'cp-translations/strings/en_US/messages.po';

const messages = {
  en_US: messagesEnUs,
};

let i18n;
function createInstance() {
  Vue.use(VueI18n);
  i18n = new VueI18n({
    locale: 'en_US',
    messages,
  });
}

const getter = {
  get i18n() {
    if (!i18n) {
      createInstance();
    }
    return i18n;
  },
};

export default getter.i18n;
