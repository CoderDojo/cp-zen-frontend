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
        allPosts: null,
      };
    },
    computed: {
      posts() {
        const newsPosts = (this.news).map(post => ({
          type: 'News',
          date: post.date,
          link: post.link,
          title: post.title.rendered,
        }));

        const forumPosts = (this.forums).map(post => ({
          type: 'Forums',
          date: post.timestampISO,
          link: `https://forums.coderdojo.com/topic/${post.slug}`,
          title: post.title,
        }));

        return newsPosts.concat(forumPosts);
      },
    },
    methods: {
      async loadNews() {
        const res = await NewsForumsService.loadNews();
        this.news = res.body;
      },
      async loadForums() {
        const res = await NewsForumsService.loadForums();
        this.forums = res.body.topics;
      },
    },
    async created() {
      await this.loadNews();
      await this.loadForums();
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
