<template>
  <div class="row">
    <div class="events"></div>
  </div>
</template>

<script>
  export default {
    name: 'events',
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";
  @import "../common/variables";

  .events {
    background-color: @cd-purple;
    padding: 0 32px;
    min-height: 432px;
    display: flex;
    align-items: center;
  }
</style>
