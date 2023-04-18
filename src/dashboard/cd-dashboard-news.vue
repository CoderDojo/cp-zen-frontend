<template>
  <div class="column">
    <div v-if="isDisplayable" class="cd-dashboard-news">
      <h2 class="cd-dashboard-news__header">{{ $t('News') }}</h2>
      <hr class ="cd-dashboard-news__divider visible-xs">
      <div class="cd-dashboard-news__posts" v-for="post in allPosts">
        <span class="cd-dashboard-news__posts-left">
          <!-- <p class="cd-dashboard-news__post-type hidden-xs">{{ post.type }}</p> -->
          <p class="cd-dashboard-news__post-date">{{ post.formattedDate }}</p>
        </span>
        <span class="cd-dashboard-news__posts-right">
          <a class="cd-dashboard-news__post-title" :href="`${post.link}`" v-html="post.title" v-ga-track-exit-nav></a>
        </span>
      </div>
    </div>
    <div v-else class="cd-dashboard-news">
      <h2 class="cd-dashboard-news__header">{{ $t('News') }}</h2>
      <div class="cd-dashboard-news__posts cd-filler">
        <div class="cd-dashboard-news__posts--filler"></div>
      </div>
    </div>
    <div class="cd-dashboard-news__cta">
      <a class="cd-dashboard-news__view-all" href="https://coderdojo.com/news/" v-ga-track-exit-nav>{{ $t('View more news') }}</a>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import Vue from 'vue';
  import UpdatesService from './service';

  export default {
    name: 'cd-dashboard-news',
    data() {
      return {
        news: [],
        // forums: [],
      };
    },
    computed: {
      allPosts() {
        // if (this.news && this.forums) {
        //   const joinedPosts = [...this.formattedNews, ...this.formattedForums];
        if (this.news.length > 0) {
          const joinedPosts = [...this.formattedNews];
          return this.sortPostsByDate(joinedPosts).splice(0, 6);
        }
        return null;
      },
      formattedNews() {
        return (this.news).map(post => ({
          type: 'News',
          date: moment(post.date),
          link: `${Vue.config.newsUrlBase}${post.uri}`,
          title: post.title,
        }));
      },
      // formattedForums() {
      //   return (this.forums).map(post => ({
      //     type: 'Forums',
      //     date: moment(post.timestampISO),
      //     link: `https://forums.coderdojo.com/topic/${post.slug}`,
      //     title: post.title,
      //   }));
      // },
      isDisplayable() {
        return (this.allPosts && this.news.length > 0);
      },
    },
    methods: {
      async loadNews() {
        const res = await UpdatesService.loadNews();
        const resultJson = await res.json();
        this.news = resultJson.data.posts.nodes;
      },
      // async loadForums() {
      //   const res = await UpdatesService.loadForums();
      //   this.forums = res.body.topics;
      // },
      sortPostsByDate(posts) {
        const sortedPosts = posts.sort((a, b) =>
          b.date - a.date);
        return sortedPosts.map(post => Object.assign({
          formattedDate: post.date.utc().format('DD/MM/YYYY'),
        }, post));
      },
    },
    async created() {
      this.loadNews();
      // this.loadForums();
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-filler-loading";
  @import "../common/variables";

  .cd-dashboard-news {
    background-color: #fff;
    padding: 0 @margin*2;
    min-height: 432px;
    max-width: 940px;
    display: flex;
    flex-direction: column;

    &__header {
      margin: 45px 0 @margin 0;
    }

    &__posts {
      .default-margin;
      display: flex;
      flex-direction: row;

      &-left {
        flex-direction: column;
        max-width: 75px;
      }

      &-right{
        margin: 0 @margin;
        max-width: 425px;
      }

      &--filler {
        background-color: @cd-very-light-grey;
        width: 650px;
        height: 60px;
        width: 100%;
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
        font-weight: bold;
          color: @cd-purple;
          &:hover {
            color: #a57ec7;
          }
      }
    }

    &__cta {
      text-align: center;
    }

    &__view-all {
      .button-link;
      color: @cd-purple;
      border-color: @cd-purple;
      margin: @margin 0 @margin*2 0;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-dashboard-news {
      max-width: 100%;

      &__divider {
        margin: 4px 0;
        border-color: @divider-grey;
      }

      &__posts {
        max-width: 100%;
        flex-direction: column-reverse;

        &-left {
          margin: 0 16px 0 16px;
        }
      }

      &__post {
        &-date {
          margin-top: 8px;
        }
      }
    }
  }
</style>
