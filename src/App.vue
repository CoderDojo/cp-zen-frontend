<template>
  <div id="app">
    <cd-header></cd-header>
    <div class="cd-menu__content-container">
      <router-view></router-view>
    </div>
    <cd-footer></cd-footer>
  </div>
</template>

<script>
  import cdHeader from './common/cd-header';
  import cdFooter from './common/cd-footer';

  export default {
    name: 'app',
    components: {
      'cd-header': cdHeader,
      'cd-footer': cdFooter,
    },
  };
</script>

<style>
  body {
    margin: 0;
    background: #EEEEEE;
    font-family: Lato, Arial, Helvetica, sans-serif;
  }
</style>
