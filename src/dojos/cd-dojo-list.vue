<template>
  <div class="cd-dojo-list">
    <ul>
      <li v-for="dojo in dojos">
        <a :href="buildDetailsPageUrl(dojo.url_slug || dojo.urlSlug)" class="cd-dojo-list__list-item">
          {{dojo.name}} ({{ dojo.private | cd-dojo-private }})
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
  import path from 'path';
  import DojosService from './service';

  export default {
    name: 'dojoList',
    props: ['coordinates'],
    data() {
      return {
        dojos: [],
      };
    },
    methods: {
      getDojos() {
        DojosService.getDojosByLatLong(this.coordinates.latitude, this.coordinates.longitude)
          .then((response) => {
            this.dojos = response.body;
          });
      },
      buildDetailsPageUrl(urlSlug) {
        return path.join('/dojos/', urlSlug);
      },
    },
    created() {
      this.getDojos();
    },
  };
</script>
