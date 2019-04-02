<template>
  <div class="cd-ics-link">
    <details class="input-group">
      <summary ref="summary">{{ $t('Add to your calendar') }}</summary>
      <input type="text" name="httpUrl" :value="httpUrl" ref="httpUrl" class="form-control"/>
      <div class="input-group-append btn-group">
        <button name="copy" class="btn btn-default" @click="toClipboard"><i class="fa fa-copy"></i></button>
        <a :href="webcalUrl" class="btn btn-default" name="open" role="button"><i class="fa fa-external-link"></i></a>
      </div>
    </details>
  </div>
</template>
<script>
  import moment from 'moment';

  export default {
    name: 'IcsLink',
    props: ['dojoId'],
    methods: {
      toClipboard() {
        this.$refs.httpUrl.focus();
        this.$refs.httpUrl.select();
        // Clipboard API requires permission, this doesn't :O
        return document.execCommand('copy');
      },
    },
    computed: {
      currentDomain() {
        return window.origin;
      },
      host() {
        return window.location.host;
      },
      webcalUrl() {
        return `webcal://${this.host}${this.url}`;
      },
      httpUrl() {
        return `${this.currentDomain}${this.url}`;
      },
      url() {
        const afterDate = moment().unix();
        const utcOffset = moment().utcOffset();
        return `/api/3.0/dojos/${this.dojoId}/events.ics?query[status]=published&query[afterDate]=${afterDate}&query[utcOffset]=${utcOffset}`;
      },
    },
  };
</script>
<style scoped lang="less">
  .cd-ics-link {
    input {
      max-width: 170px;
      border-right-width: 0px;
    }
    .btn-group {
      .btn:first-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
</style>
