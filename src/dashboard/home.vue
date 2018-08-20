<template>
  <div class="home">
    <events/>
    <div class="home__container">
      <div class="home__right-column">
        <projects/>
        <news />
      </div>
      <children class="home__left-column"/>
      <!-- <stats class="home__left-column"/> -->
    </div>
  </div>
</template>

<script>
import Events from '@/dashboard/events';
import Projects from '@/dashboard/projects';
import Children from '@/dashboard/children';
import News from '@/dashboard/news';
import Stats from '@/dashboard/stats';

export default {
  name: 'Home',
  data() {
    return {
    };
  },
  components: {
    Events,
    Projects,
    Children,
    News,
    Stats,
  },
};
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";

  .home {
    display: flex;
    flex-direction: column;

    &__container {
      display:flex;
      margin: 0 -16px;
    }

    &__left-column {
      max-width: 340px;
      flex: 4;
    }
  }
</style>
