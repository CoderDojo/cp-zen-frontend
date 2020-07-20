<template>
  <div class="lang-wrapper" v-bind:dir="textDirection">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['direction'],
  computed: {
    textDirection() {
      if (this.direction) {
        return this.direction;
      }

      const config = this.$store.getters.chosenLanguageConfig;
      let direction = 'ltr';
      if (config && config.dir) {
        direction = config.dir;
      }
      return direction;
    },
  },
};
</script>

<style>
</style>
