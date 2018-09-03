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
    computed: {
      allUpdates() {
        return [...this.formattedNews, ...this.formattedForums];
      },
      formattedNews() {
        return (this.news).map(post => ({
          type: 'News',
          date: post.date,
          link: post.link,
          title: post.title.rendered,
        }));
      },
      formattedForums() {
        return (this.forums).map(post => ({
          type: 'Forums',
          date: post.timestampISO,
          link: `https://forums.coderdojo.com/topic/${post.slug}`,
          title: post.title,
        }));
      },
    },
    methods: {
      async loadNews() {
        const res = await NewsForumsService.loadNews({ per_page: 6 });
        this.news = res.body;
      },
      async loadForums() {
        const res = await NewsForumsService.loadForums();
        this.forums = res.body.topics;
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
      margin: 45px 0 16px 0;
    }
  }
</style>
