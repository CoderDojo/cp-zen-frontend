<template>
  <div class="cd-dashboard-projects">
    <h2 class="cd-dashboard-projects__header hidden-xs">{{ $t('Before your next event, here are some projects you can try') }}</h2>
    <h2 class="cd-dashboard-projects__header visible-xs">{{ $t('Here are some projects you can try') }}</h2>
    <hr class ="cd-dashboard-projects__divider visible-xs">
    <div v-show="isDisplayable" class="cd-dashboard-projects__cards">
      <a class="cd-dashboard-projects__card" v-for="project in projects" :key="project.id" 
        :href="`https://projects.raspberrypi.org/${locale}/projects/${project.attributes.repositoryName}`"
        v-ga-track-exit-nav>
        <img :src="project.attributes.content.heroImage" />
        <h4>{{ project.attributes.content.title }}</h4>
      </a>
    </div>
    <div v-show="!isDisplayable" class="cd-dashboard-projects__cards cd-filler">
      <div class="cd-dashboard-projects__card cd-dashboard-projects__card--filler"></div>
      <div class="cd-dashboard-projects__card cd-dashboard-projects__card--filler"></div>
      <div class="cd-dashboard-projects__card cd-dashboard-projects__card--filler"></div>
    </div>
    <div class="cd-dashboard-projects__cta">
      <a class="cd-dashboard-projects__view-all" :href="`https://projects.raspberrypi.org/${locale}`" v-ga-track-exit-nav>{{ $t('View more projects') }}</a>
    </div>
  </div>
</template>

<script>
  import ProjectsService from '@/projects/service';
  import LocaleService from '@/locale/service';

  export default {
    name: 'cd-dashboard-projects',
    data() {
      return {
        projects: null,
        locale: 'en',
      };
    },
    computed: {
      isDisplayable() {
        return this.projects !== null;
      },
      userLocale() {
        const langCookie = LocaleService.getUserLocale();
        if (langCookie) {
          return langCookie.replace(/"/g, '').replace('_', '-');
        }
        return 'en';
      },
    },
    methods: {
      async loadProjects(locale = 'en') {
        const projects = (await ProjectsService.list(locale, { order: 'desc' })).body;
        if (projects) {
          this.projects = projects.data.slice(0, 3);
        }
      },
    },
    async created() {
      await this.loadProjects(this.userLocale);
      // Retry with "en" as a language
      if (!this.projects || !this.projects.length) {
        await this.loadProjects();
      } else {
        // Set the projects urls to the valid zen locale
        this.locale = this.userLocale;
      }
    },
  };
</script>

<style scoped lang="less">
  @import "~@coderdojo/cd-common/common/_colors";
  @import "../common/styles/cd-primary-button.less";
  @import "../common/variables";
  @import "../common/styles/cd-filler-loading";

  .cd-dashboard-projects {
    background-color: #fff;
    padding: 0 32px;

    &__header {
      margin: 45px 0 16px 0;
    }

    &__cards {
      display: flex;
      margin: 0 -12px;
    }

    &__card {
      flex: 1;
      margin: 16px 12px;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #979797;
      color: #222;
      text-decoration: none;
      transition: 0.2s transform ease-in-out;

      img {
        width: 100%;
      }

      h4 {
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        margin: 18px;
      }

      &[href]:hover {
        transform: scale(1.025);
      }

      &--filler {
        height: 200px;
        border: none;
        background-color: @cd-very-light-grey;
      }
    }

    &__cta {
      text-align: center;
    }

    &__view-all {
      .button-link;
      color: @cd-purple;
      border-color: @cd-purple;
      margin: 32px 0;
    }
  }

  @media (max-width: @screen-xs-max) {
    .cd-dashboard-projects {
      max-width: 100%;

      &__divider {
        border-color: @divider-grey;
      }

      &__cards {
        flex-direction: column;
      }

      &__card {
        margin: 12px 32px;
      }
    }
  }
</style>
