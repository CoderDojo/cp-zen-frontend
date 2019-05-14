<template>
  <div>

    <label for="quantity">{{ $t(label) }}</label>
    <input type="number"
           v-model="quantity"
           name="quantity" />
  </div>

</template>
<script>
export default {
  $_veeValidate: {
    name() {
      return this.label;
    },
    value() {
      return this.quantity;
    },
  },
  name: 'form-ticket',
  props: [
    'label',
    'default-quantity',
  ],
  data() {
    return {
      quantity: null,
    };
  },
  methods: {
    createTicket() {
      console.log('TODO');
    },
  },
  created() {
    this.quantity = this.defaultQuantity;
  },
};

</script>
<style scoped lang="less">

</style>
