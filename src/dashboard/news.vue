<template>
  <div class="column">
    <div class="news">
      <h3 class="news__header">Community News and Forum Updates</h3>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'news',
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";
  @import "../common/variables";

  .news {
    background-color: #f4f5f6;
    padding: 0 32px;
    min-height: 432px;
    width: 940px;
    display: flex;

    &__header {
      padding: 16px;
    }
  }
</style>
