<template>
  <div class="cd-dojo-list">
    <dojo-list-item v-for="dojo in getDojos()" :key="dojo.id" :dojo="dojo"></dojo-list-item>
    <pagination for="dojos-pagination" :records="dojos.length" :per-page="dojoPerPage" :count-text="$t('Showing {from} to {to} of {count} dojos|{count} dojos|One dojo')"></pagination>
  </div>
</template>
<script>
  import { Pagination, PaginationEvent } from 'vue-pagination-2';
  import DojoListItem from './cd-dojo-list-item';

  export default {
    name: 'dojoList',
    props: ['dojos'],
    data() {
      return {
        dojoPerPage: 6,
        page: 1,
      };
    },
    components: {
      Pagination,
      DojoListItem,
    },
    methods: {
      getDojos() {
        const begin = (this.page - 1) * this.dojoPerPage;
        const end = begin + this.dojoPerPage;
        return this.dojos.slice(begin, end);
      },
    },
    created() {
      PaginationEvent.$on('vue-pagination::dojos-pagination', (page) => {
        this.page = page;
      });
    },
  };
</script>
