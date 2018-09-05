<template>
  <div class="cd-dashboard-projects">
    <h3 class="cd-dashboard-projects__header">Before your next event, here are some projects you can try</h3>
    <div v-show="isDisplayable" class="cd-dashboard-projects__cards">
      <a class="cd-dashboard-projects__card" v-for="project in projects" :key="project.id" :href="`https://projects.raspberrypi.org/en/projects/${project.attributes.repositoryName}`">
        <img :src="project.attributes.content.heroImage" />
        <h4>{{ project.attributes.content.title }}</h4>
      </a>
    </div>
    <div v-show="!isDisplayable" class="cd-dashboard-projects__cards">
      <div class="cd-dashboard-projects__card cd-dashboard-projects__card--filler cd-filler"></div>
      <div class="cd-dashboard-projects__card cd-dashboard-projects__card--filler cd-filler"></div>
      <div class="cd-dashboard-projects__card cd-dashboard-projects__card--filler cd-filler"></div>
    </div>
    <div class="cd-dashboard-projects__cta">
      <a class="cd-dashboard-projects__view-all" href="https://projects.raspberrypi.org">View all projects</a>
    </div>
  </div>
</template>

<script>
  import ProjectsService from '@/projects/service';

  export default {
    name: 'cd-dashboard-projects',
    data() {
      return {
        projects: null,
      };
    },
    computed: {
      isDisplayable() {
        return this.projects !== null;
      },
    },
    methods: {
      async loadProjects() {
        this.projects = (await ProjectsService.list({ order: 'asc' })).body.data.slice(0, 3);
      },
    },
    created() {
      this.loadProjects();
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
      margin: 0 12px;
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
      color: @cd-purple;
      border: 1px solid @cd-purple;
      font-size: 16px;
      font-weight: bold;
      padding: 14px;
      display: inline-block;
      border-radius: 4px;
      margin: 32px 0;
    }
  }
</style>
