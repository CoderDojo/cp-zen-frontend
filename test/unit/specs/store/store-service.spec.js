import StoreService from '@/store/store-service';

describe('Store Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should save parent data', () => {
    const data = { key: 'value' };
    sinon.stub(window.sessionStorage, 'setItem');
    StoreService.save('parent-save', data);
    expect(window.sessionStorage.setItem).to.have.been.calledWith('parent-save', JSON.stringify(data));
  });

  it('should load parent data', () => {
    const data = { key: 'value' };
    sinon.stub(window.sessionStorage, 'getItem').withArgs('parent-load').returns(JSON.stringify(data));
    expect(StoreService.load('parent-load')).to.deep.equal(data);
  });

  it('should delete parent data', () => {
    sinon.stub(window.sessionStorage, 'removeItem');
    StoreService.delete('parent-delete');
    expect(window.sessionStorage.removeItem).to.have.been.calledWith('parent-delete');
  });
});
