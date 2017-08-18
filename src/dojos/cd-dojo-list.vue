<template>
  <div class="cd-dojo-list">
    <dojo-list-item v-for="dojo in paginatedDojos" :key="dojo.id" :dojo="dojo"></dojo-list-item>
    <pagination ref="pagination" for="dojo-pagination" :records="dojos.length" :per-page="dojosPerPage" count-text=""></pagination>
  </div>
</template>
<script>
  import Vue from 'vue';
  import { Pagination, PaginationEvent } from 'vue-pagination-2';
  import { clone } from 'lodash';
  import DojoListItem from './cd-dojo-list-item';
  import dojoPaginationStore from './dojo-pagination-store';

  // TODO: fix bug with p query where values above numOfPages can be entered
  // TODO: unit and e2e tests :D
  // TODO: styling

  export default {
    name: 'dojoList',
    props: ['dojos'],
    data() {
      return {
        dojosPerPage: dojoPaginationStore.state.dojosPerPage,
      };
    },
    components: {
      Pagination,
      DojoListItem,
    },
    computed: {
      currentPage() {
        return dojoPaginationStore.state.page;
      },
      // dojos to be displayed on the current page
      paginatedDojos() {
        const begin = (this.currentPage - 1) * this.dojosPerPage;
        const end = begin + this.dojosPerPage;
        dojoPaginationStore.commit('setCount', this.dojos.slice(begin, end).length);
        return this.dojos.slice(begin, end);
      },
    },
    created() {
      // if theres a valid page number in the url, set the page
      if (this.$route.query.p) {
        dojoPaginationStore.commit('setPage', this.$route.query.p);
      }
      // on pagination buttons being interacted with
      PaginationEvent.$on('vue-pagination::dojo-pagination', (page) => {
        const newQuery = clone(this.$route.query);
        newQuery.p = page;
        this.$router.push({ query: newQuery });
      });
    },
    watch: {
      paginatedDojos() {
        Vue.nextTick(() => this.$refs.pagination.setPage(this.currentPage));
      },
      $route(newRoute) {
        // if theres a valid page number in the new url, set the page
        if (newRoute.query.p) {
          dojoPaginationStore.commit('setPage', newRoute.query.p);
        }
      },
    },
  };
</script>
