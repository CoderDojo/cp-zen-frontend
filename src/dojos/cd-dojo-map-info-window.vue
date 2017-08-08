<template>
  <div class="cd-dojo-map-info-window">
    <p class="cd-dojo-map-info-window__name"><router-link :to="detailsPageUrl"> {{ dojo.name }}</router-link></p>
    <p>{{buildDojoFrequency(dojo)}}</p>
  </div>
</template>

<script>
  import DojosUtil from '@/dojos/util';

  export default {
    name: 'DojoMapInfoWindow',
    props: ['dojo'],
    computed: {
      detailsPageUrl() {
        return `/dojos/${this.dojo.url_slug || this.dojo.urlSlug}`;
      },
    },
    methods: {
      buildDojoFrequency: DojosUtil.buildDojoFrequency,
    },
  };
</script>

<style scoped lang="less">
  .cd-dojo-map-info-window {
    padding: 4px 0 0 0;

    &__name {
      font-weight: bold;
    }

    p {
      font-size: 14px;
      margin: 0 0 4px;
    }
  }
</style>
