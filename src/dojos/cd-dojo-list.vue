<template>
  <div class="cd-dojo-list">
    <p class="cd-dojo-list__show-dojo-list-count">{{ $t('Showing {numPerPage} of {total} Dojos', { numPerPage: dojos.length, total: dojos.length }) }}</p>
    <dojo-list-item v-for="dojo in dojos" :key="dojo.id" :dojo="dojo"></dojo-list-item>
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
    &__show-dojo-list-count {
      font-size: 14px;
      color: #a2a1a0;
      font-weight: 200;
      border-bottom: solid 1px #bebebe;
    }
  }
</style>
