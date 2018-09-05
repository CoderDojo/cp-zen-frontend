<template>
  <div class="column">
    <div class="cd-dashboard-projects">
      <h3 class="cd-dashboard-projects__header">Before your next event, here are some projects you can try</h3>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'cd-dashboard-projects',
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";
  @import "../common/variables";

  .cd-dashboard-projects {
    background-color: #fff;
    padding: 0 32px;
    min-height: 432px;
    width: 940px;
    display: flex;

    &__header {
      margin: 45px 0 16px 0;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-dashboard-projects {
      max-width: 100%;
    }
  }
</style>
