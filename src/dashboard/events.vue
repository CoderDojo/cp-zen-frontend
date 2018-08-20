<template>
  <div class="row">
    <div class="events">
      <h1 class="events__header">Upcoming Events</h1>
    </div>
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
    justify-content: center;

    &__header {
      color: #fff;
      padding: 16px;
    }
  }
</style>
