<template>
  <div class="row">
    <div class="col-md-4 col-sm-6">
      <span class="fa fa-language fa-2x cd-lang-picker__icon"></span>
      <select class="cd-lang-picker__select" v-model="lang">
        <option v-for="availableLanguage in availableLanguages" :value="availableLanguage.value">{{ availableLanguage.name }}</option>
      </select>
    </div>
    <div class="col-md-8 col-sm-6">
      <a href="https://crowdin.com/project/zen-community-platform" class="cd-lang-picker__translate-link">{{ $t('Help us translate') }}</a>
    </div>
  </div>
</template>

<script>
  import { find } from 'lodash';
  import Cookie from 'js-cookie';
  import LocaleService from './service';

  export default {
    data() {
      return {
        lang: 'en_US', // default
        availableLanguages: [
          {
            name: 'English (United States)',
            value: 'en_US',
          },
          {
            name: 'Nederlands (Nederland)',
            value: 'nl_NL',
          },
          {
            name: 'Deutsch (Deutschland)',
            value: 'de_DE',
          },
          {
            name: 'Italiano (Italia)',
            value: 'it_IT',
          },
          {
            name: 'Polski (Polska)',
            value: 'pl_PL',
          },
          {
            name: 'Português (Portugal)',
            value: 'pt_PT',
          },
          {
            name: 'Español (España)',
            value: 'es_ES',
          },
          {
            name: 'Türkçe (Türkiye)',
            value: 'tr_TR',
          },
          {
            name: 'Български (България)',
            value: 'bg_BG',
          },
          {
            name: 'Ελληνικά (Ελλάδα)',
            value: 'el_GR',
          },
          {
            name: 'Eesti (Eesti)',
            value: 'et_EE',
          },
          {
            name: 'हिंदी (इंडिया)',
            value: 'hi_IN',
          },
          {
            name: '日本語 (日本)',
            value: 'ja_JP',
          },
          {
            name: 'Română (România)',
            value: 'ro_RO',
          },
          {
            name: 'Español (Argentina)',
            value: 'es_AR',
          },
          {
            name: 'Français (France)',
            value: 'fr_FR',
          },
          {
            name: 'Maltese (Malta)',
            value: 'mt_MT',
          },
          {
            name: 'Slovenski (Slovenija)',
            value: 'sl_SL',
          },
          {
            name: 'Slovenský (Slovensko)',
            value: 'sk_SK',
          },
          {
            name: 'Українська (Україна)',
            value: 'uk_UK',
          },
        ],
      };
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
            this.$i18n.setLocaleMessage(val, strings);
            this.$i18n.locale = val;
          });
      },
    },
    created() {
      const browserLocale = navigator.language.replace('-', '_');
      const matchingLocale = find(this.availableLanguages,
        language => language.value === browserLocale);
      const langCookie = Cookie.get('NG_TRANSLATE_LANG_KEY');
      if (langCookie) {
        this.lang = langCookie.substring(1, langCookie.length - 1);
      } else if (matchingLocale) {
        this.lang = browserLocale;
      } else {
        this.lang = 'en_US';
      }
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
