import vueUnitHelper from 'vue-unit-helper';
import cdDojoListItem from '@/dojos/cd-dojo-list-item';

describe('The Dojo List Item vue', () => {
  const mockDojo = {
    entity$: '-/cd/dojos',
    name: 'CD ROM',
    geoPoint: {
      lat: 53.349351,
      lon: -6.247585999999956,
    },
    stage: 0,
    urlSlug: 'ie/dublin/cd-rom',
    private: 1,
    id: 'b850b40e-1e10-4e3a-8a46-d076c94946c6',
    address1: 'Pivotal Labs, CHQ building, Dublin 1',
    countryName: 'Ireland',
    email: '',
    facebook: null,
    googleGroup: null,
    twitter: null,
    notes: '<h2>Suggested Notes:<br />\n<br />\nPlease bring:</h2>\n\n<ul>\n\t<li>\n\t<h2>A laptop. Borrow one from somebody if needs be.</h2>\n\t</li>\n\t<li>\n\t<h2><strong>A parent! (Very important). If you are 12 or under, your parent must stay with you during the session.</strong></h2>\n\t</li>\n</ul>\n\n<h2>&nbsp;</h2>\n',
    placeName: 'Dublin',
    time: 'Sunday 10am',
    website: null,
  };

  it('should compute a details page url', () => {
    // ARRANGE
    const vm = vueUnitHelper(cdDojoListItem);
    vm.dojo = mockDojo;

    // ASSERT
    expect(vm.detailsPageUrl).to.equal('/dojos/ie/dublin/cd-rom');
  });

  it('should compute an image url for given dojo id', () => {
    // ARRANGE
    const vm = vueUnitHelper(cdDojoListItem);
    vm.dojo = mockDojo;

    // ASSERT
    expect(vm.imageUrl).to.equal('https://s3-eu-west-1.amazonaws.com/zen-dojo-images/b850b40e-1e10-4e3a-8a46-d076c94946c6');
  });

  it('should compute a Private string when dojo.private is 1', () => {
    // ARRANGE
    const vm = vueUnitHelper(cdDojoListItem);
    vm.dojo = {
      private: 1,
    };

    // ASSERT
    expect(vm.privacy).to.equal('Private');
  });

  it('should compute a Public string when dojo.private is 0', () => {
    // ARRANGE
    const vm = vueUnitHelper(cdDojoListItem);
    vm.dojo = {
      private: 0,
    };

    // ASSERT
    expect(vm.privacy).to.equal('Public');
  });
});
