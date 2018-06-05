<template>
<div>
  <a v-show="!this.hasSpecialReq" class="cd-special-req-component_add" @click="showSpecialReq"> <span><i class="fa fa-plus-circle" aria-hidden="true"></i></span> <span>{{ $t('Add special requirements') }}</span></a>
  <span v-show="this.hasSpecialReq"><label>{{ $t('Special requirements') }}</label>
  <textarea v-cols="50" class="form-control" v-model="specialReqInput" :placeholder="$t('Please tell us about any special requirements that we might need to know of here (eg. need wheelchair access)')" @blur="onBlur" @focus="onFocus"/></span>

</div> 
</template>

<script>
  export default {
    name: 'cd-special-req-component',
    data() {
      return {
        specialReqSelect: '',
        specialReqInput: '',
        hasSpecialReq: false,
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
      showSpecialReq() {
        this.hasSpecialReq = true;
        return this.hasSpecialReq;
      },
    },
    computed: {
      specialRequirement: {
        get() {
          return this.specialReqInput;
        },
        set(specialReqVal) {
          if (specialReqVal) {
            this.hasSpecialReq = true;
            this.specialReqInput = specialReqVal;
          } else {
            this.hasSpecialReq = false;
          }
        },
      },
    },
    watch: {
      specialRequirement() {
        this.$emit('input', this.specialRequirement);
      },
    },
  };
</script>
