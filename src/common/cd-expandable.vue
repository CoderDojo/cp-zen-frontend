<template>
  <div class="cd-expandable">
    <div class="cd-expandable__slot" :class="expanded ? 'cd-expandable__slot--expanded': 'cd-expandable__slot--closed'">
      <slot></slot>
    </div>
    <a @click="expanded = !expanded" class="cd-expandable__action"
      :class="isExpandable ? 'cd-expandable__action--expandable': 'cd-expandable__action--hidden'">
      {{ $t(linkName) }}
      <i :class="expanded? 'fa fa-chevron-left': 'fa fa-chevron-right'"></i>
    </a>
  </div>
</template>

<script>
  // TODO : make it more generic so that the text can be passed down
  export default {
    name: 'cd-expandable',
    data() {
      return {
        expanded: false,
        isExpandable: true,
      };
    },
    mounted() {
      this.$nextTick(() => {
        // Remove the action if the total height is lesser than 10ch
        this.isExpandable = this.$el.querySelector('.cd-expandable__slot').clientHeight > 80;
      });
    },
    computed: {
      linkName() {
        return this.expanded ? 'Hide' : 'Read full event details';
      },
    },
  };
</script>

<style scoped lang="less">
  @import "../common/variables";
  .cd-expandable {
    &__slot {
      word-break: break-all;
      &--expanded {
        height: initial;
      }
      &--closed {
        overflow-y: hidden;
        max-height: 10ch;
      }
    }
    &__action {
      .fa {
        font-size: @font-size-small;
      }
      &--expandable {
        display: inherit;
      }
      &--hidden {
        display: none;
      }
    }
  }
</style>
