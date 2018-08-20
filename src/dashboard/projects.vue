<template>
  <div class="column">
    <div class="projects"></div>
  </div>
</template>

<script>
  export default {
    name: 'projects',
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";
  @import "../common/variables";

  .projects {
    background-color: #f4f5f6;
    padding: 0 32px;
    min-height: 432px;
    width: 940px;
    display: flex;
    align-items: center;
  }
</style>
