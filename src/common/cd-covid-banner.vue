<template>
    <div class="cd-banner">
      <p>
         {{ $t('Thank you for your interest in joining the CoderDojo community!') }}
         {{ $t('Due to the coronavirus pandemic, there are different restrictions in place across the world.') }}
         {{ $t('Please follow the appropriate public health advice for your country or region before planning in-person club events.') }}
      </p>
      <p>
        {{ $t('If you are ready to hold in-person club events soon, please') }}
        <a class="cd-banner-link" href="https://zen.coderdojo.com/dashboard/start-dojo">{{ $t('register your details') }}</a>
        {{ $t('and we will be in touch.') }}
      </p>
      <p>
        {{ $t('If you’re not able to start your Dojo in person yet, there are many other ways that you can get involved in the meantime.') }}
        {{ $t('Check out the exciting opportunities for young people, parents, volunteers, and educators to learn and get creative with tech through') }}
        <a class="cd-banner-link" target="_blank" href="https://www.raspberrypi.org/learn/?utm_source=coderdojo&utm_medium=covid-banner&utm_campaign=dmah">{{ $t('Digital Making at Home') }}</a>
        {{ $t('from the Raspberry Pi Foundation.') }}
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
