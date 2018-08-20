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

  .cd-dashboard-stats {
    background-color: #fff;
    padding: 0 32px;
    margin-left: auto;
    min-height: 100%;
    display:flex;

    &__header {
      padding: 16px;
    }
  }
</style>

