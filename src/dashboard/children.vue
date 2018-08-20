<template>
  <div class="column">
    <div class="children">
      <h1 class="children__header">My Kids</h1>
    </div>
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
    margin-left: auto;
    min-height: 100%;
    display:flex;

    &__header {
      padding: 16px;
    }
  }
</style>

