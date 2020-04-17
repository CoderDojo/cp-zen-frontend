<template>
    <div class="cd-banner">
      <p>{{ $t('Thank you for your interest in joining the CoderDojo community!') }}</p>
      <p>{{ $t('Due to the coronavirus pandemic, we have paused the Dojo verification process.') }}</p>
      <p>{{ $t('In the meantime, we’re providing exciting opportunities for young people, parents, volunteers, and educators to get creative with tech through') }}
        <a class="cd-banner-link" href="https://www.raspberrypi.org/at-home/">{{ $t('Digital Making at Home') }}</a> {{ $t('from the Raspberry Pi Foundation.') }}
      </p>
    </div>
</template>

<script>
</script>

<style scoped lang="less">
  .cd-banner {
    background-color: #63257D;
    color: #fff;
    margin: 0 -16px;
    padding: 24px 32px 14px;
  }

  .cd-banner-link {
    color: #fff;
    text-decoration: underline;
    font-weight: bold;
  }
</style>
