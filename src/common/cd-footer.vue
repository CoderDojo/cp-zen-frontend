<template>
  <footer id="footer" class="cd-footer">
    <div class="row">
      <div class="col-sm-3">
        <p>{{ $t('Maintained by') }}</p>
        <img class="cd-footer__foundation-logo" src="~@coderdojo/cd-common/dist/coderdojo-foundation.svg" />
        </svg>
      </div>
      <div class="col-sm-3">
        <p class="cd-footer__address-line">CoderDojo Foundation,</p>
        <p class="cd-footer__address-line">Dogpatch Labs Unit 1,</p>
        <p class="cd-footer__address-line">The CHQ building,</p>
        <p class="cd-footer__address-line">Custom House Quay,</p>
        <p class="cd-footer__address-line">Dublin, Ireland</p>
        <p class="cd-footer__address-line">D01 Y6H7</p>
      </div>
      <div class="col-sm-3"></div>
      <div class="col-sm-3">
        <p v-for="link in links"><a :href="link.href">{{ $t(link.text) }}</a></p>
        <p class="cd-footer__social-icons">
          <a v-for="link in socialLinks" :href="link.href">
            <span class="fa-stack fa-lg">
              <i class="fa fa-circle fa-stack-2x" aria-hidden="true"></i>
              <i :class="'fa fa-' + link.icon + ' fa-stack-1x cd-footer__social-icons__icon'" aria-hidden="true"></i>
            </span>
          </a>
        </p>
      </div>
    </div>

    <lang-picker></lang-picker>
  </footer>
</template>

<script>
import LangPicker from '@/locale/cd-lang-picker';

export default {
  name: 'cd-footer',
  components: {
    LangPicker,
  },
  data() {
    return {
      links: [
        {
          href: 'https://hwf.zendesk.com/hc/',
          text: 'Help Center',
        },
        {
          href: '/charter',
          text: 'Charter',
        },
        {
          href: '/privacy-statement',
          text: 'Privacy Statement',
        },
        {
          href: 'http://github.coderdojo.com',
          text: 'Contribute',
        },
      ],
      socialLinks: [
        {
          href: 'https://twitter.com/coderdojo',
          icon: 'twitter',
        },
        {
          href: 'https://facebook.com/coderdojo',
          icon: 'facebook',
        },
        {
          href: 'https://plus.google.com/+coderdojo',
          icon: 'google-plus',
        },
        {
          href: 'https://www.linkedin.com/company/coderdojo',
          icon: 'linkedin',
        },
        {
          href: 'https://coderdojo.com/contact/',
          icon: 'envelope',
        },
      ],
    };
  },
};
</script>

<style lang="less">
  @import "~@coderdojo/cd-common/cd-common";
</style>
