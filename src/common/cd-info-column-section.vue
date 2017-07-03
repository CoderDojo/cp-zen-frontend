<template>
  <div class="cd-info-column-section">
    <div class="cd-info-column-section__header">
      <div class="cd-info-column-section__header-icon">
        <i :class="'fa fa-' + icon" aria-hidden="true"></i>
      </div>
      <div class="cd-info-column-section__header-text">
        {{ header }}
      </div>
    </div>
    <div class="cd-info-column-section__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'InfoColumnSection',
    props: ['header', 'icon'],
  };
</script>

<style scoped lang="less">
  @import "~cd-common/common/_colors";

  .cd-info-column-section {
    font-size: 16px;
    margin: 48px 32px;

    &__header {
      color: @cd-purple;
      display: flex;

      &-icon {
        width: 16px;
        text-align: center;
      }

      &-text {
        margin-left: 8px;
        text-transform: uppercase;
        font-weight: bold;
      }
    }
  }
</style>
