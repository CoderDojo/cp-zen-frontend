<template>
  <div :class="{ 'btn-group': true, 'open': open }">
    <button type="button" :class="buttonClass" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="open = !open" @blur="onButtonBlur">
      <i v-if="icon" :class="iconClass"></i>{{ text }} <span class="caret"></span>
    </button>
    <ul :class="{ 'dropdown-menu': true, 'dropdown-menu--right': align === 'right' }">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'Dropdown',
    props: {
      icon: String,
      text: String,
      align: String,
      type: {
        type: String,
        default: 'default',
      },
    },
    data() {
      return {
        open: false,
      };
    },
    computed: {
      iconClass() {
        return `fa fa-${this.icon}`;
      },
      buttonClass() {
        return `btn btn-${this.type} dropdown-toggle`;
      },
    },
    methods: {
      onButtonBlur(event) {
        if (!event.srcElement.parentNode.contains(event.relatedTarget)) {
          this.open = false;
        }
      },
    },
  };
</script>

<style scoped>
  .fa {
    width: 16px;
    text-align: center;
    margin-right: 4px;
  }

  .dropdown-menu--right {
    left: inherit;
    right: 0;
  }
</style>
