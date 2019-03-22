<template>
  <div class="cd-dashboard__poll" >
      <a :href="`https://docs.google.com/forms/d/e/1FAIpQLSfkYe44Upu9ezRd7FUytxnvgmZuDxbQTPAj1BcdiqxFoBUslA/viewform?usp=pp_url&entry.1799182697=${dojoName}`" v-ga-track-exit-nav>
        <i class="fa fa-info-circle"></i>{{ $t('We always ask new Dojos to do a 2 minutes survey.') }} {{ $t('You don\'t have to but it helps the whole community!') }}
      </a>
  </div>
</template>

<script>
  export default {
    name: 'cd-dashboard-admin-survey',
    props: ['dojoName'],
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/variables";

  .cd-dashboard{
    &__poll {
      text-align: center;
      margin-bottom: @margin;
      a {
        color: @cd-white;
        text-decoration: underline;
        i {
          margin-right: 8px;
        }
      }
    }
  }
</style>
