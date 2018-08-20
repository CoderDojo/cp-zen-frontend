<template>
  <div class="column">
    <div class="stats"></div>
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
    height: 100%;
    display:flex;
    margin-left: auto;
  }
</style>

