<template>
  <div class="cd-info-column-section">
    <div class="cd-info-column-section__header" v-if="header">
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
  @import "../common/variables";

  .cd-info-column-section {
    font-size: 16px;
    margin: 48px 0;

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

    &__content {
      word-wrap: break-word;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-info-column-section {
      margin: 16px 0;
      font-size: 14px;
    }
  }
</style>
