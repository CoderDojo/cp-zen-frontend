<template>
  <div class="cd-expandable">
    <div class="cd-expandable__slot" :class="expanded ? 'cd-expandable__slot--expanded': 'cd-expandable__slot--closed'">
      <slot></slot>
    </div>
    <a @click="expanded = !expanded" class="cd-expandable__action">{{ $t(linkName) }}
      <i :class="expanded? 'fa fa-chevron-left': 'fa fa-chevron-right'"></i>
    </a>
  </div>
</template>

<script>
  export default {
    name: 'cd-expandable',
    data() {
      return {
        expanded: false,
      };
    },
    computed: {
      linkName() {
        return this.expanded ? 'Retract' : 'Read full event details';
      },
    },
  };
</script>

<style scoped lang="less">
  @import "../common/variables";
  .cd-expandable {
    &__slot {
      &--expanded {
        height: initial;
      }
      &--closed {
        max-height: 100px;
        overflow-y: hidden;
      }
    }
    &__action {
      .fa {
        font-size: @font-size-small;
      }
    }
  }
</style>
