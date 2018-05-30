<template>
<div>
  <select class="select-box form-control" v-model="specialReqSelect" @blur="onBlur" @focus="onFocus">
    <option value="" selected data-default disabled>{{ $t('Select an option') }}</option>
    <option value="no">{{ $t('No') }}</option>
    <option value="yes">{{ $t('Yes') }}</option>
  </select>
  <input v-show="selectYes" class="form-control" v-model="specialReqInput" :placeholder="$t('Type here')" @blur="onBlur" @focus="onFocus"/>
</div> 
</template>

<script>
  export default {
    name: 'cd-special-req-component',
    props: ['value'],
    data() {
      return {
        specialReqSelect: '',
        specialReqInput: '',
      };
    },
    methods: {
      onBlur() {
        this.blurTimeout = window.setTimeout(() => {
          this.$emit('blur');
        }, 50);
      },
      onFocus() {
        window.clearTimeout(this.blurTimeout);
      },
    },
    computed: {
      selectYes() {
        return this.specialReqSelect === 'yes';
      },
      specialRequirement: {
        get() {
          if (this.specialReqSelect === 'yes') {
            return this.specialReqInput;
          }
          return this.specialReqSelect;
        },
        set(specialReqVal) {
          if (specialReqVal === 'yes') {
            this.specialReqSelect = 'yes';
            this.specialReqInput = specialReqVal;
          } else {
            this.specialReqSelect = specialReqVal;
          }
        },
      },
    },
    watch: {
      specialRequirement() {
        if (this.specialRequirement) {
          this.$emit('input', this.specialRequirement);
        }
      },
    },
  };
</script>

<style scoped lang="less">
  .select-box {
      margin-bottom: 8px;
    }  
</style>
