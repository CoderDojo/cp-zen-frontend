<template>
  <div class="cd-login">
    <form @submit.prevent="login">
      <input type="email" v-model="email" />
      <input type="password" v-model="password" />
      <input type="submit" value="Login" />
    </form>
  </div>
</template>

<script>
  import UserService from './service';

  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      login() {
        UserService.login(this.email, this.password)
          .then(() => {
            this.$router.push('/');
          });
      },
    },
  };
</script>
