import Vue from 'vue';
import i18n from '@/i18n';

export default function (str, interpolationOptions) {
  const template = i18n.t(str, interpolationOptions);
  const res = Vue.compile(`<span>${template}</span>`);

  return {
    name: 'Translation',
    props: ['props'],
    render: res.render,
    staticRenderFns: res.staticRenderFns,
  };
}
