<template>
  <div class="row row-no-gutters cd-form-ticket">
    <div class="col-sm-2">
      <label class="cd-form-ticket__label" for="quantity">{{ $t(label) }}</label>
    </div>
    <div class="col-sm-2">
      <input type="number" class="form-control" v-model="quantity" name="quantity" />
    </div>
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
    'type',
  ],
  data() {
    return {
      quantity: null,
    };
  },

  methods: {
    createTicket() {
      return {
        name: this.label,
        type: this.type,
        quantity: this.quantity,
      };
    },
    setQuantity(q) {
      this.quantity = q;
    },
  },
  created() {
    this.quantity = this.defaultQuantity;
  },
};

</script>
<style scoped lang="less">
  @import "../../common/variables";

  .cd-form-ticket {
    margin-bottom: @margin;
    &__label {
      width: 16%;
    }
  }
</style>
