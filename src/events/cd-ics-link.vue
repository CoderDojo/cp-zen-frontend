<template>
  <div class="cd-ics-link">
    <details class="input-group">
      <summary ref="summary">{{ $t('Add to your calendar') }}</summary>
      <input type="text" name="httpUrl" :value="httpUrl" ref="httpUrl" class="form-control"/>
      <div class="input-group-append btn-group">
        <button name="copy" class="btn btn-default" v-ga-track-click="'ics-clipboard'" @click="toClipboard"><i class="fa fa-copy"></i></button>
        <a :href="webcalUrl" class="btn btn-default" name="open" role="button" v-ga-track-click="'ics-webcal'"><i class="fa fa-external-link"></i></a>
      </div>
      <p :class="[copied ? 'cd-ics-link__copy-label--hidden' : 'cd-ics-link__copy-label']">{{ $t('iCalendar feed copied!') }}</p>
    </details>
  </div>
</template>
<script>
  import moment from 'moment';

  export default {
    name: 'IcsLink',
    props: ['dojoId'],
    data() {
      return {
        copied: false,
      };
    },
    methods: {
      toggleCopy() {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      },
      toClipboard() {
        this.$refs.httpUrl.focus();
        this.$refs.httpUrl.select();
        // Clipboard API requires permission, this doesn't :O
        document.execCommand('copy');
        this.toggleCopy();
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
    &__copy-label {
      transition: opacity 1s ease-out;
      opacity: 0;
      overflow: hidden;
      position: relative;
      &--hidden {
        opacity: 1;
      }
    }
  }
</style>
