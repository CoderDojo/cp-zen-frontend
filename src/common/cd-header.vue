<template>
  <header class="cd-menu">
    <div class="cd-menu__desktop-nav">
      <div class="cd-menu__first-row">
        <a href="/">
          <img src="~@coderdojo/cd-common/dist/coderdojo-logo-light-bg.svg" width="120" height="44" />
        </a>
        <div class="cd-menu__flex-spacer"></div>
        <div class="cd-menu__nav-right">
            <a class="emphasis" href="https://help.coderdojo.com">{{ $t('Help') }}</a>
          <div class="cd-menu__account">
            <a :href="registerPath">{{ $t('Register') }}</a>
            <a :href="loginPath">{{ $t('Login') }}</a>
         </div>
         <div class="cd-menu__profile">
            <div class="cd-menu__profile-pic"></div>
            <span class="cd-menu__profile-name">{{ $t('My Account') }}</span>
            <i class="cd-menu__sub-menu-icon fa fa-chevron-down"></i>
            <ul class="cd-menu__profile-menu">
              <li><a class="cd-menu__profile-link">{{ $t('My Profile') }}</a></li>
              <li><a href="/dashboard/my-dojos">{{ $t('My Dojos') }}</a></li>
              <li><a href="/dashboard/dojos/events/user-events">{{ $t('My Events') }}</a></li>
              <li class="cd-menu__parent-link"><a href="/dashboard/children">{{ $t('My Children') }}</a></li>
              <li class="cd-menu__e-learning-link"><a href="/dashboard/profile/lms">{{ $t('E-learning') }}</a></li>
              <li class="cd-menu__cdf-admin-link"><a href="/dashboard/manage-dojos">{{ $t('Manage Dojos') }}</a></li>
              <li class="cd-menu__cdf-admin-link"><a href="http://badgekit.coderdojo.com/">Badgekit</a></li>
              <li class="cd-menu__cdf-admin-link"><a href="/dashboard/stats">{{ $t('Stats') }}</a></li>
              <li><a class="cd-menu__referer-link" :href="logoutPath">{{ $t('Logout') }}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <ul class="cd-menu__second-row">
        <li v-for="link in navigationLinks" :class="link.subLinks ? 'cd-menu__dropdown' : ''">
          <a v-if="!link.subLinks" :href="link.href">{{ $t(link.text) }}</a>
          <span v-if="link.subLinks">
            {{ $t(link.text) }}
            <i class="cd-menu__dropdown-icon fa fa-chevron-down"></i>
            <ul>
              <li v-for="subLink in link.subLinks"><a :href="subLink.href">{{ $t(subLink.text) }}</a></li>
            </ul>
          </span>
        </li>
      </ul>
    </div>
    <div class="cd-menu__mobile-nav-bar">
      <button type="button" class="cd-menu__hamburger" aria-expanded="false" aria-controls="navbar">
        <span class="sr-only">{{ $t('Toggle navigation') }}</span>
        <span class="cd-menu__hamburger-bar"></span>
        <span class="cd-menu__hamburger-bar"></span>
        <span class="cd-menu__hamburger-bar"></span>
      </button>
      <a href="/">
        <img src="~@coderdojo/cd-common/dist/coderdojo-logo-light-bg.svg" width="120" height="44" style="padding-left: 5px;" />
      </a>
    </div>
    <div class="cd-menu__scrim"></div>
    <nav id="cd-menu__sliding-menu-primary" class="cd-menu__sliding-menu" data-toggle="closed">
      <div class="cd-menu__close-row">
        <span class="cd-menu__close-button">&times;</span>
      </div>
      <div class="cd-menu__content">
        <div class="cd-menu__content-pre">
          <a class="emphasis" href="https://help.coderdojo.com">{{ $t('Help') }}</a>
          <div class="cd-menu__account">
            <a :href="registerPath">{{ $t('Register') }}</a>
            <a :href="loginPath">{{ $t('Login') }}</a>
          </div>
          <ul class="cd-menu__content-block">
            <li class="cd-menu__profile">
              <span>
                <div class="cd-menu__profile-pic"></div>
                <span class="cd-menu__profile-name">{{ $t('My Account') }}</span>
                <i class="cd-menu__sub-menu-icon fa fa-chevron-right"></i>
              </span>
              <div class="cd-menu__sliding-menu cd-menu__sliding-menu-secondary" data-toggle="closed">
                <div class="cd-menu__close-row cd-bg-alt-white">
                  <span class="cd-menu__back-button fa fa-chevron-left fa-lg"></span>
                  <span class="cd-menu__close-button">&times;</span>
                </div>
                <div class="cd-menu__content">
                  <div class="cd-menu__content-block cd-menu__profile-header">
                    <div class="cd-menu__profile-pic"></div>
                    <span class="cd-menu__profile-name"></span>
                  </div>
                  <ul class="cd-menu__content-block cd-menu__profile-menu">
                    <li><a class="cd-menu__profile-link">{{ $t('My Profile') }}</a></li>
                    <li><a href="/dashboard/my-dojos">{{ $t('My Dojos') }}</a></li>
                    <li><a href="/dashboard/dojos/events/user-events">{{ $t('My Events') }}</a></li>
                    <li class="cd-menu__parent-link"><a href="/dashboard/children">{{ $t('My Children') }}</a></li>
                    <li class="cd-menu__e-learning-link"><a href="/dashboard/profile/lms">{{ $t('E-learning') }}</a></li>
                    <li class="cd-menu__cdf-admin-link"><a href="/dashboard/manage-dojos">{{ $t('Manage Dojos') }}</a></li>
                    <li class="cd-menu__cdf-admin-link"><a href="http://badgekit.coderdojo.com/">Badgekit</a></li>
                    <li class="cd-menu__cdf-admin-link"><a href="/dashboard/stats">{{ $t('Stats') }}</a></li>
                    <li><a class="cd-menu__referer-link" :href="logoutPath">{{ $t('Logout') }}</a></li>
                  </ul>
                </div>
              </div>
            </li>
            <li v-for="link in navigationLinks">
              <a v-if="!link.subLinks" :href="link.href">{{ $t(link.text) }}</a>
              <span v-if="link.subLinks">
                <span>
                  {{ $t(link.text) }}
                  <i class="cd-menu__sub-menu-icon fa fa-chevron-right"></i>
                </span>
                <div class="cd-menu__sliding-menu cd-menu__sliding-menu-secondary" data-toggle="closed">
                  <div class="cd-menu__close-row">
                    <span class="cd-menu__back-button fa fa-chevron-left fa-lg"></span>
                    <span class="cd-menu__close-button">&times;</span>
                  </div>
                  <div class="cd-menu__content">
                    <div class="cd-menu__content-block cd-menu__header">
                      <span>{{ link.text }}</span>
                    </div>
                    <ul class="cd-menu__content-block">
                      <li v-for="subLink in link.subLinks"><a :href="subLink.href">{{ $t(subLink.text) }}</a></li>
                    </ul>
                  </div>
                </div>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import '@coderdojo/cd-common/dist/cd-common.min';

export default {
  name: 'cd-header',
  data() {
    const rpiAuthFlag = window.localStorage.getItem('rpiAuth') === 'true';
    return {
      loginPath: rpiAuthFlag ? '/rpi/login' : '/login',
      logoutPath: rpiAuthFlag ? '/rpi/logout' : '/logout',
      registerPath: rpiAuthFlag ? '/rpi/register' : '/register/user',
      navigationLinks: [
        {
          href: 'https://coderdojo.com/about/',
          text: 'About',
        },
        {
          href: 'https://coderdojo.com/attend-a-dojo/',
          text: 'Attend a Dojo',
        },
        {
          href: 'https://coderdojo.com/volunteer/',
          text: 'Volunteer',
        },
        {
          href: 'https://coderdojo.com/start-a-dojo/',
          text: 'Start a Dojo',
        },
        {
          href: 'https://coderdojo.com/resources/',
          text: 'Resources',
        },
        {
          href: 'https://coderdojo.com/news/',
          text: 'News',
        },
        {
          text: 'Community',
          subLinks: [
            {
              href: '/badges',
              text: 'Badges',
            },
            {
              href: 'https://forums.coderdojo.com/',
              text: 'Forums',
            },
            {
              href: 'https://ninjaforums.coderdojo.com/',
              text: 'Ninja Forums',
            },
            {
              href: 'http://coolestprojects.org/',
              text: 'Coolest Projects',
            },
          ],
        },
      ],
    };
  },
  mounted() {
    window.cdMenu({
      zenBase: '/',
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import "~@coderdojo/cd-common/cd-common";
</style>
