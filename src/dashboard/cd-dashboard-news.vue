<template>
  <div class="column">
    <div class="cd-dashboard-news">
      <h3 class="cd-dashboard-news__header">Community News and Forum Updates</h3>
    </div>
  </div>
</template>

<script>
  import NewsForumsService from './service';

  export default {
    name: 'cd-dashboard-news',
    data() {
      return {
        news: null,
        forums: null,
      };
    },
    methods: {
      loadNews() {
        this.news = NewsForumsService.loadNews();
      },
      loadForums() {
        this.forums = NewsForumsService.loadForums();
      },
    },
    async created() {
      this.loadNews();
      this.loadForums();
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";
  @import "../common/variables";

  .cd-dashboard-news {
    background-color: #f4f5f6;
    padding: 0 32px;
    min-height: 432px;
    width: 940px;
    display: flex;

    &__header {
      padding: 16px;
    }
  }
</style>
