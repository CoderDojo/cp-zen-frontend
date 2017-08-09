<template>
  <div class="cd-dojo-list-item media">
    <div class="media-left">
      <router-link :to="getDojoUrl(dojo)">
        <img v-img-fallback="{src: imageUrl, fallback: loadImage}" class="img-circle cd-dojo-list-item__dojo-image"/>
      </router-link>
    </div>
    <div class="media-body">
      <h4 class="media-heading">
        <router-link :to="getDojoUrl(dojo)" class="cd-dojo-list-item__name">
          {{dojo.name}} ({{ $t(privacy) }})
        </router-link>
      </h4>
      <p class="cd-dojo-list-item__meta">{{dojo.address1}}</p>
      <p class="cd-dojo-list-item__meta">{{buildDojoFrequency(dojo)}}</p>
    </div>
  </div>
</template>

<script>
  import ImgFallback from '@/common/directives/cd-img-fallback';
  import DojosUtil from '@/dojos/util';

  export default {
    name: 'DojoListItem',
    props: ['dojo'],
    directives: {
      ImgFallback,
    },
    methods: {
      getDojoUrl: DojosUtil.getDojoUrl,
      buildDojoFrequency: DojosUtil.buildDojoFrequency,
    },
    computed: {
      imageUrl() {
        return `https://s3-eu-west-1.amazonaws.com/zen-dojo-images/${this.dojo.id}`;
      },
      loadImage() {
        /* eslint-disable global-require */
        return require('../assets/avatars/dojo-default-logo.png');
        /* eslint-enable global-require */
      },
      privacy() {
        return this.dojo.private === 1 ? 'Private' : 'Public';
      },
    },
  };
</script>

<style scoped lang="less">
@import "../common/variables";

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

  @media (max-width: @screen-xs-max) {
    .cd-dojo-list-item {
      margin: 24px 0;

      &__name {
        font-size: 16px;
      }

      &__meta {
        font-size: 14px;
      }
    }
  }


</style>
