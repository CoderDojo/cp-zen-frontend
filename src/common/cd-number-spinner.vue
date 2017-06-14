<template>
  <div class="cd-number-spinner">
    <i @click="decrement" class="cd-number-spinner__decrement fa fa-lg fa-minus" :disabled="value <= min"></i>
    <input type="text" class="cd-number-spinner__value form-control" readonly v-model="value"/>
    <i @click="increment" class="cd-number-spinner__increment fa fa-lg fa-plus" :disabled="value >= max"></i>
  </div>
</template>

<script>
  export default {
    name: 'NumberSpinner',
    props: ['min', 'max'],
    data() {
      return {
        value: 0,
      };
    },
    methods: {
      increment() {
        if (this.value + 1 <= this.max) {
          this.value += 1;
          this.$emit('update', this.value);
        }
      },
      decrement() {
        if (this.value - 1 >= this.min) {
          this.value -= 1;
          this.$emit('update', this.value);
        }
      },
    },
  };
</script>

<style scoped lang="less">
  .cd-number-spinner {
    display: flex;
    align-items: center;

    &__decrement, &__increment {
      color: #0093d5;
      cursor: pointer;
      align-self: stretch;
      padding: 0 8px;
      display: flex;
      align-items: center;

      &[disabled=disabled], &[disabled=disabled]:hover {
        color: #0093d5;
        cursor: not-allowed;
      }

      &:hover {
        color: #005e89;
      }
    }

    &__value {
      width: 40px;
      text-align: center;
    }
  }
</style>
