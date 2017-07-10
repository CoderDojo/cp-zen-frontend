<template>
  <div class="cd-info-column">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'InfoColumn',
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .cd-info-column {
    background-color: #f4f5f6;
    padding: 0 32px;
  }
</style>
