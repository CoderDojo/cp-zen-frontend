<template>
  <div class="cd-dojo-list">
    <p class="cd-dojo-list__show-dojo-list-count">Showing {{dojos.length}} of {{dojos.length}} Dojos</p>
    <dojo-list-item v-for="dojo in dojos" :dojo="dojo"></dojo-list-item>
  </div>
</template>
<script>
  // import path from 'path';
  import DojoListItem from './cd-dojo-list-item';

  export default {
    name: 'dojoList',
    props: ['dojos'],
    components: {
      DojoListItem,
    },
  };
</script>
<style scoped lang="less">
  .cd-dojo-list {
    padding-top: 34px;

    &__show-dojo-list-count {
      font-size: 14px;
      color: #a2a1a0;
      font-weight: 200;
      border-bottom: solid 1px #bebebe;
    }
  }
</style>
