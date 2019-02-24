import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';

/* eslint-disable no-extend-native, no-param-reassign, func-names */
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, position) {
    const subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    const lastIndex = subjectString.lastIndexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(Vuex);

Vue.config.productionTip = false;
Vue.config.apiServer = process.env.API_SERVER;
Vue.config.forumsUrlBase = process.env.FORUMS_URL_BASE;
Vue.config.s3server = process.env.S3_SERVER;

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
const srcContext = require.context('../../src', true, /^\.\/(?!main(\.js)?$)/);
srcContext.keys().forEach(srcContext);
