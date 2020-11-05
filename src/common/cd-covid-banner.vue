<template>
    <div class="cd-banner">
      <cd-text-direction-wrapper direction="ltr">
        <p>
          {{ $t('Thank you for your interest in CoderDojo!') }}
          {{ $t('The coronavirus pandemic continues to impact all our lives, including how Dojos can run.') }}
          {{ $t('See') }}
          <a class="cd-banner-link" href="https://coderdojo.com/ways-to-run/">{{ $t('our resources and guidance on the creative ways Dojos are running.') }}</a>
        </p>
        <p>
          {{ $t('If you are ready to hold in-person club events soon, please') }}
          <a class="cd-banner-link" href="https://zen.coderdojo.com/dashboard/start-dojo">{{ $t('register your details') }}</a>
          {{ $t('and we will be in touch.') }}
        </p>
        <p>
          {{ $t('If you’re not able to start your Dojo in person yet, there are many other ways that you can get involved in the meantime.') }}
          {{ $t('Check out the exciting opportunities for young people, parents, volunteers, and educators to learn and get creative with tech through') }}
          <a class="cd-banner-link" target="_blank" href="https://www.raspberrypi.org/learn/?utm_source=coderdojo&amp;utm_medium=covid-banner&amp;utm_campaign=dmah">{{ $t('Digital Making at Home') }}</a>
          {{ $t('from the Raspberry Pi Foundation.') }}
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
