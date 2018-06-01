<template>
  <router-view v-if="event && dojo"></router-view>
</template>

<script>
  import store from '@/store';
  import { mapGetters } from 'vuex';

  export default {
    store,
    props: {
      eventId: {
        required: true,
        type: String,
      },
    },
    computed: {
      ...mapGetters(['dojo']),
      ...mapGetters('order', ['event']),
    },
    created() {
      this.$store.dispatch('order/loadEvent', this.eventId);
    },
  };
</script>
