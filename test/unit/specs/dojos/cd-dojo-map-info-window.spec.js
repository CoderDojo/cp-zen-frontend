import vueUnitHelper from 'vue-unit-helper';
import DojoMapInfoWindow from '@/dojos/cd-dojo-map-info-window';


describe('Dojo Map Info Window', () => {
  it('should compute a details page url', () => {
    // ARRANGE
    const vm = vueUnitHelper(DojoMapInfoWindow);
    vm.dojo = {
      urlSlug: 'ie/dublin/cd-rom',
    };

    // ASSERT
    expect(vm.detailsPageUrl).to.equal('/dojos/ie/dublin/cd-rom');
  });
});
