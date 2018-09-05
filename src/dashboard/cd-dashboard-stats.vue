<template>
  <div class="column">
    <div class="cd-dashboard-stats">
      <h1 class="cd-dashboard-stats__header">Dojo Stats</h1>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'cd-dashboard-stats',
    components: {
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/variables";

  .cd-dashboard-stats {
    background-color: #f4f5f6;
    padding: 0 32px;
    margin-left: auto;
    min-height: 100%;
    max-width: 340px;
    display:flex;

    &__header {
      margin: 45px 0 16px 0;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-dashboard-stats {
      max-width: 100%;
    }
  }
</style>

