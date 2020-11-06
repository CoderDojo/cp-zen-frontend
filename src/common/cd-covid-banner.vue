<template>
    <div class="cd-banner">
      <cd-text-direction-wrapper direction="ltr">
        <p>
          {{ $t('Thank you for your interest in CoderDojo!') }}
          {{ $t('The coronavirus pandemic continues to impact all our lives, including how Dojos can run.') }}
          {{ $t('See') }}
          <a class="cd-banner-link" href="https://coderdojo.com/ways-to-run/">{{ $t('our resources and guidance on the creative ways Dojos are running.') }}</a>
        </p>
      </cd-text-direction-wrapper>
    </div>
</template>

<script>
import cdTextDirectionWrapper from './cd-text-direction-wrapper';

export default {
  components: {
    cdTextDirectionWrapper,
  },
};
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
