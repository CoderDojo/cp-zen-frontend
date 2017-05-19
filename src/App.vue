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
  import CDHeader from './components/CDHeader';
  import CDFooter from './components/CDFooter';

  export default {
    name: 'app',
    components: {
      'cd-header': CDHeader,
      'cd-footer': CDFooter,
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
