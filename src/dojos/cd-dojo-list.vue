<template>
  <div class="cd-dojo-list">
    <dojo-list-item v-for="dojo in dojos" :key="dojo.id" :dojo="dojo"></dojo-list-item>
  </div>
</template>
<script>
  import DojoListItem from './cd-dojo-list-item';

  export default {
    name: 'dojoList',
    props: ['dojos'],
    components: {
      DojoListItem,
    },
  };
</script>
