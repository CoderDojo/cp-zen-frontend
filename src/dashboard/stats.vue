<template>
  <div class="column">
    <div class="stats">
      <h1 class="stats__header">Dojo Stats</h1>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'stats',
    components: {
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .stats {
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

