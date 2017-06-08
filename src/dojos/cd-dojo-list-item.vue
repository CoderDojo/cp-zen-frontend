<template>
  <div class="cd-dojo-list-item media">
    <div class="media-left">
      <img v-img-fallback="{src: imageUrl, fallback: loadImage}" class="img-circle cd-dojo-list-item__dojo-image"/>
    </div>
    <div class="media-body">
      <h4 class="media-heading">
        <router-link :to="detailsPageUrl" class="cd-dojo-list-item__name">
          {{dojo.name}} ({{ dojo.private | cd-dojo-private }})
        </router-link>
      </h4>
      <p>{{dojo.address1}}</p>
      <p>{{dojo.time}}</p>
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
    },
  };
</script>

<style scoped lang="less">

  .cd-dojo-list-item {
    &__dojo-image {
      width: 42px;
      height: 42px;
    }
  }


</style>
