<template>
<div>
  <select class="select-box form-control" v-model="genderSelect" @blur="onBlur" @focus="onFocus">
    <option value="" selected data-default disabled>{{ $t('Select an option') }}</option>
    <option value="Male">{{ $t('Male') }}</option>
    <option value="Female">{{ $t('Female') }}</option>
    <option value="Undisclosed">{{ $t('Prefer not to answer') }}</option>
    <option value="specify">{{ $t('Specify Identity') }}</option>
  </select>
  <input v-show="specifyGender" class="form-control" v-model="genderInput" :placeholder="$t('Identify as...')" @blur="onBlur" @focus="onFocus"/>
</div> 
</template>

<script>
  export default {
    name: 'cd-gender-component',
    props: ['value'],
    data() {
      return {
        genderSelect: '',
        genderInput: '',
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
      specifyGender() {
        return this.genderSelect === 'specify';
      },
      gender: {
        get() {
          this.whyGender = false;
          if (this.genderSelect === 'specify') {
            return this.genderInput;
          }
          return this.genderSelect;
        },
        set(genderVal) {
          if (genderVal !== ('Male' || 'Female' || 'Undisclosed')) {
            this.genderSelect = 'specify';
            this.genderInput = genderVal;
          } else {
            this.genderSelect = genderVal;
          }
        },
      },
    },
    watch: {
      gender() {
        if (this.gender) {
          this.$emit('input', this.gender);
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
