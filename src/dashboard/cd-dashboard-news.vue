<template>
  <div class="column">
    <div v-if="isDisplayable" class="cd-dashboard-news">
      <h2 class="cd-dashboard-news__header">{{ $t('News and Community Forum Updates') }}</h2>
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
    <div v-else class="cd-dashboard-news">
      <h2 class="cd-dashboard-news__header">{{ $t('News and Community Forum Updates') }}</h2>
      <div class="cd-dashboard-news__posts cd-filler">
        <div class="cd-dashboard-news__posts--filler"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import NewsForumsService from './service';

  export default {
    name: 'cd-dashboard-news',
    data() {
      return {
        news: null,
        forums: null,
        loadedPosts: false,
      };
    },
    computed: {
      allPosts() {
        if (this.news && this.forums) {
          const joinedPosts = [...this.formattedNews, ...this.formattedForums];
          return this.sortPostsByDate(joinedPosts).splice(0, 6);
        }
        return null;
      },
      formattedNews() {
        return (this.news).map(post => ({
          type: 'News',
          date: moment(post.date),
          link: post.link,
          title: post.title.rendered,
        }));
      },
      formattedForums() {
        return (this.forums).map(post => ({
          type: 'Forums',
          date: moment(post.timestampISO),
          link: `https://forums.coderdojo.com/topic/${post.slug}`,
          title: post.title,
        }));
      },
      isDisplayable() {
        return this.loadedPosts;
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
        this.loadedPosts = true;
      },
      sortPostsByDate(posts) {
        const sortedPosts = posts.sort((a, b) =>
         b.date - a.date);
        return (sortedPosts.map(post => (Object.assign({
          type: post.type,
          date: (post.date).utc().format('DD/MM/YYYY'),
          link: post.link,
          title: post.title,
        }))));
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
  @import "../common/styles/cd-filler-loading";

  .cd-dashboard-news {
    background-color: #fff;
    padding: 0 32px;
    min-height: 432px;
    width: 940px;
    display: flex;
    flex-direction: column;

    &__header {
      padding: 16px;
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

      &--filler {
        background-color: @cd-very-light-grey;
        width: 650px;
        height: 60px;
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
