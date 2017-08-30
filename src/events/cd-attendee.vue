<template>
  <div class="cd-attendee">
    <span class="cd-attendee__username">{{ user.name }}</span>
    <span class="cd-attendee__ticket">{{ ticket.type }}</span>
    <span class="cd-attendee__session">{{ session.name }}</span>
  </div>
</template>
<script>
  export default {
    name: 'Attendee',
    props: ['ticket', 'session', 'user'],
  };
</script>
<style scoped lang="less">
  @import "../common/variables";
  .cd-attendee {
    display: flex;
    &__username {
      font-size: @font-size-h4;
    }
    &__username, &__ticket, &__session {
      flex: 1;
    }
  }
</style>
