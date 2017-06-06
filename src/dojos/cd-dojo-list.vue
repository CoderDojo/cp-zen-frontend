<template>
  <div class="cd-dojo-list">
    <ul>
      <li v-for="dojo in dojos">
        <router-link :to="buildDetailsPageUrl(dojo.url_slug || dojo.urlSlug)" class="cd-dojo-list__list-item">
          {{dojo.name}} ({{ dojo.private | cd-dojo-private }})
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
  import path from 'path';

  export default {
    name: 'dojoList',
    props: ['dojos'],
    methods: {
      buildDetailsPageUrl(urlSlug) {
        return path.join('/dojos/', urlSlug);
      },
    },
  };
</script>
