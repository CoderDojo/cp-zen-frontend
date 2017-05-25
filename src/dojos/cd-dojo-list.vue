<template>
  <div class="cd-dojo-list">
    <ul>
      <li v-for="dojo in dojos" class="cd-dojo-list__list-item">
        {{dojo.name}}
      </li>
    </ul>
  </div>
</template>
<script>
  import DojosService from './service';

  export default {
    name: 'dojoList',

    data() {
      return {
        dojos: [],
      };
    },

    methods: {
      getDojos() {
        DojosService.getDojos().then((response) => {
          this.dojos = response.body;
        });
      },
    },
    created() {
      this.getDojos();
    },
  };

</script>
