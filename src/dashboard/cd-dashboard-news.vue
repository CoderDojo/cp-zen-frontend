<template>
  <div class="column">
    <div class="cd-dashboard-news">
      <h2 class="cd-dashboard-news__header">Community News and Forum Updates</h2>
      <div class="cd-dashboard-news__posts" v-for="post in allPosts">
        <span class="cd-dashboard-news__posts-left">
          <p class="cd-dashboard-news__post-type">{{ post.type }}</p>
          <p class="cd-dashboard-news__post-date">{{ post.date }}</p>
        </span>
        <span class="cd-dashboard-news__posts-right">
          <h4 class="cd-dashboard-news__post-title">
            <a class="cd-dashboard-news__post-title-link" :href="`${post.link}`">{{ post.title }}</a>
          </h4>
        </span>
      </div>
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
      allPosts() {
        if (this.news && this.forums) {
          const joinedPosts = ((this.news).map(post => ({
            type: 'News',
            date: (post.date.split('T')[0]).split('-').join(''),
            link: post.link,
            title: post.title.rendered,
          })).concat((this.forums).map(post => ({
            type: 'Forums',
            date: (post.timestampISO.split('T')[0]).split('-').join(''),
            link: `https://forums.coderdojo.com/topic/${post.slug}`,
            title: post.title,
          }))));

          return this.sortPostsByDate(joinedPosts).splice(0, 6);
        }
        return null;
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
      sortPostsByDate(posts) {
        const sortedPosts = posts.sort((a, b) =>
         a.date - b.date);
        return (sortedPosts.map(post => (Object.assign({
          type: post.type,
          date: [post.date.slice(0, 4), post.date.slice(4, 6), post.date.slice(6, 8)].reverse().join('/'),
          link: post.link,
          title: post.title,
        })))).reverse();
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
    padding: 0 32px 45px;
    min-height: 432px;
    width: 940px;
    display: flex;
    flex-direction: column;

    &__header {
      margin: 45px 0 16px 0;
    }

    &__posts {
      margin: 16px 0;
      display: flex;
      flex-direction: row;
      max-width: 75%;

      &-left {
        flex-direction: column;
        margin: 0 16px 0 16px;
        max-width: 30%;
      }

      &-right{
        margin: 0 16px 0 16px;
        max-width: 70%;
      }
    }

    &__post {
      &-type {
        font-weight: bold;
      }

      &-date {
        color: #7b8082;
      }

      &-title {
        margin: 0;

        &-link {
          color: @cd-purple;
          &:hover {
            color: #a57ec7;
          }
        }
      }
    }

  }
</style>
