<template>
  <div class="row">
    <div class="col-md-4 col-sm-6">
      <span class="fa fa-language fa-2x cd-lang-picker__icon"></span>
      <select class="cd-lang-picker__select" v-model="lang">
        <option v-for="availableLanguage in availableLanguages" :value="availableLanguage.code" v-bind:key="availableLanguage.code">{{ availableLanguage.name }} ({{ availableLanguage.country }})</option>
      </select>
    </div>
    <div class="col-md-8 col-sm-6">
      <a href="https://crowdin.com/project/zen-community-platform" class="cd-lang-picker__translate-link">{{ $t('Help us translate') }}</a>
    </div>
  </div>
</template>

<script>
  import { find } from 'lodash';
  import moment from 'moment';
  import Cookie from 'js-cookie';
  import Vue from 'vue';
  import LocaleService from './service';

  export default {
    data() {
      return {
        lang: 'en_US', // default
        availableLanguages: [],
      };
    },
    methods: {
      async getAvailableLanguages() {
        return Vue.http.get(`${Vue.config.apiServer}/locale/languages`);
      },
      setMomentLocale(locale) { // e.g. mt_MT
        const momentLocale = locale.replace('_', '-').toLowerCase(); // mt-mt
        const setMomentLocale = moment.locale(momentLocale); // zh-tw
        if (momentLocale.indexOf(setMomentLocale) === -1) { // if mt-mt contains zh-tw
          moment.locale('en'); // default to en
        }
      },
    },
    watch: {
      lang(val) {
        Cookie.set('NG_TRANSLATE_LANG_KEY', `"${val}"`);
        LocaleService.getStrings(val)
          .then((response) => {
            const strings = response.body;
            Object.keys(strings).forEach((key) => {
              if (strings[key] === '') {
                strings[key] = key;
              }
            });
            this.setMomentLocale(val);
            this.$i18n.setLocaleMessage(val, strings);
            this.$i18n.locale = val;
            const matchingLanguageConfig = find(this.availableLanguages,
              language => language.code === val);
            this.$store.dispatch('updateChosenLanguageConfig', matchingLanguageConfig);
          });
      },
    },
    async created() {
      this.availableLanguages = (await this.getAvailableLanguages()).body;
      const browserLocale = navigator.language.replace('-', '_');
      const matchingLanguageConfig = find(this.availableLanguages,
        language => language.code === browserLocale);
      const langCookie = Cookie.get('NG_TRANSLATE_LANG_KEY');
      if (langCookie) {
        this.lang = langCookie.substring(1, langCookie.length - 1);
      } else if (matchingLanguageConfig) {
        this.lang = browserLocale;
      } else {
        this.lang = 'en_US';
      }
      this.$store.dispatch('updateChosenLanguageConfig', matchingLanguageConfig);
    },
  };
</script>

<style scoped lang="less">
  .cd-lang-picker {
    &__icon {
      vertical-align: middle;
    }

    &__select {
      background: none;
      color: #ffffff;
      background: #303030;
      border: none;
      vertical-align: middle;
    }

    &__translate-link {
      text-decoration: none;
      line-height: 24px;
      font-size: 16px;
      display: block;
      text-align: right;
    }
  }
</style>
