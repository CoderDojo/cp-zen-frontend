<template>
  <div class="column">
    <div class="children"></div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'children',
    components: {
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .children {
    background-color: #fff;
    padding: 0 32px;
    height: 100%;
    display:flex;
    margin-left: auto;
  }
</style>

