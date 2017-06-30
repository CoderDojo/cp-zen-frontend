<template>
  <div class="cd-dojo-list-item media">
    <div class="media-left">
      <router-link :to="detailsPageUrl">
        <img v-img-fallback="{src: imageUrl, fallback: loadImage}" class="img-circle cd-dojo-list-item__dojo-image"/>
      </router-link>
    </div>
    <div class="media-body">
      <h4 class="media-heading">
        <router-link :to="detailsPageUrl" class="cd-dojo-list-item__name">
          {{dojo.name}} ({{ $t(privacy) }})
        </router-link>
      </h4>
      <p class="cd-dojo-list-item__meta">{{dojo.address1}}</p>
      <p class="cd-dojo-list-item__meta">{{dojo.time}}</p>
    </div>
  </div>
</template>

<script>
  import ImgFallback from '@/common/directives/cd-img-fallback';
  /* eslint-disable global-require */
  export default {
    name: 'DojoListItem',
    props: ['dojo'],
    directives: {
      ImgFallback,
    },
    computed: {
      detailsPageUrl() {
        return `/dojos/${this.dojo.url_slug || this.dojo.urlSlug}`;
      },
      imageUrl() {
        return `https://s3-eu-west-1.amazonaws.com/zen-dojo-images/${this.dojo.id}`;
      },
      loadImage() {
        return require('../assets/avatars/dojo-default-logo.png');
      },
      privacy() {
        return this.dojo.private === 1 ? 'Private' : 'Public';
      },
    },
  };
</script>

<style scoped lang="less">

  .cd-dojo-list-item {
    margin: 32px 0;

    &__dojo-image {
      width: 42px;
      height: 42px;
    }

    &__meta {
      font-size: 16px;
      margin-bottom: 0;
    }
  }


</style>
