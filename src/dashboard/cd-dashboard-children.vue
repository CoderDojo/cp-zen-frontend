<template>
  <div class="column">
    <div class="cd-dashboard-children">
      <h1 class="cd-dashboard-children__header">My Kids</h1>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'cd-dashboard-children',
    components: {
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";

  .cd-dashboard-children {
    background-color: #f4f5f6;
    padding: 0 32px;
    margin-left: auto;
    min-height: 100%;
    display:flex;

    &__header {
      padding: 16px;
    }
  }
</style>

