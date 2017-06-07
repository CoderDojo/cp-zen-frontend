<template>
  <div class="cd-number-spinner">
    <button @click="decrement" class="cd-number-spinner__decrement">-</button>
    <input type="text" class="cd-number-spinner__value" readonly v-model="value"/>
    <button @click="increment" class="cd-number-spinner__increment">+</button>
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

<style scoped>
</style>
