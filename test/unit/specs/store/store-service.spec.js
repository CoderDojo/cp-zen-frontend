import StoreService from '@/store/store-service';
import { clone } from 'lodash';

describe('Store Service', () => {
  it('should save parent data', () => {
    const data = { key: 'value' };
    StoreService.save('parent', data);
    expect(StoreService._store.parent).to.deep.equal(data);
  });

  it('should load parent data', () => {
    const data = { key: 'value' };
    StoreService._store.parent = clone(data);
    expect(StoreService.load('parent')).to.deep.equal(data);
  });

  it('should delete parent data', () => {
    const data = { key: 'value' };
    StoreService._store.parent = clone(data);
    StoreService.delete('parent');
    expect(StoreService._store.parent).to.equal(undefined);
  });
});
