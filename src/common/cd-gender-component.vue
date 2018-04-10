<template>
<div>
  <select class="select-box form-control" data-vv-name="gender" data-vv-validate-on="blur" v-validate="'required'" v-model="genderSelect">
    <option value="" selected data-default disabled>{{ $t('Select an option') }}</option>
    <option value="male">{{ $t('Male') }}</option>
    <option value="female">{{ $t('Female') }}</option>
    <option value="prefer not to answer">{{ $t('Prefer not to answer') }}</option>
    <option value="specify">{{ $t('Specify Identity') }}</option>
  </select>
  <input v-show="specifyGender" class="form-control" v-model="genderInput" :placeholder="$t('Identify as...')" data-vv-name="gender" data-vv-validate-on="blur" v-validate="specifyGender ? 'required' : ''"/>
<p class="gender-err text-danger" v-show="errors.has('gender:required')">{{ $t('Gender is required') }}<br/><a v-on:click="showWhy">{{ $t('Why is this required? Click here to find out more') }}</a></p>
<p class="gender-why" v-show="whyGender && errors.has('gender:required')">{{ $t(`We want to provide activities that appeal to people regardless of their gender.`) }}<br/>{{ $t(`To check how well we are succeeding, we'd like to find out whether or not people of different genders are equally likely to take part.`) }}</p>  
</div> 
</template>

<script>
  export default {
    name: 'cd-gender-component',
    props: ['gender'],
    data() {
      return {
        genderSelect: '',
        genderInput: '',
        whyGender: false,
      };
    },
    methods: {
      showWhy() {
        this.whyGender = true;
      },
    },
    computed: {
      specifyGender() {
        return this.genderSelect === 'specify';
      },
      gender() {
        this.whyGender = false;
        if (this.genderSelect === 'specify') {
          return this.genderInput;
        }
        return this.genderSelect;
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
