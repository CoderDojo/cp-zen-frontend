import Vue from 'vue';
import cdDojoList from '!!vue-loader?inject!@/dojos/cd-dojo-list';

describe('The Dojo List vue ', () => {
  it('should build a valid details page url', () => {
    const Constructor = Vue.extend(cdDojoList());
    const vm = new Constructor({
      propsData: {
        coordinates: {
          latitude: 10,
          longitude: 89,
        },
      },
    });
    expect(vm.buildDetailsPageUrl('foo')).to.equal('/dojos/foo');
    expect(vm.buildDetailsPageUrl('foo')).to.equal('/dojos/foo');
    expect(vm.buildDetailsPageUrl('foo')).to.equal('/dojos/foo');
  });
});
