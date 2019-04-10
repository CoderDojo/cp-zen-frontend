import vueUnitHelper from 'vue-unit-helper';
import IcsLink from '@/events/cd-ics-link';
import TimeShift from 'timeshift-js';

describe('ICS link component', () => {
  let sandbox;
  before(() => {
    sandbox = sinon.sandbox.create();
  });
  describe('computed', () => {
    describe('url', () => {
      it('should return the url to recover the dojo events', () => {
        const vm = vueUnitHelper(IcsLink);
        Date = TimeShift.Date; // eslint-disable-line no-global-assign
        TimeShift.setTimezoneOffset(-120); // UTC+2 (Italy, summer time)
        TimeShift.setTime(1501079400000); // 2017-07-26 16:30:00 GMT+02:00
        vm.dojoId = 1;

        expect(vm.url).to.match(/\/api\/3\.0\/dojos\/1\/events\.ics\?query\[status\]=published&query\[afterDate\]=1501079400&query\[utcOffset\]=120/);
      });
    });
    describe('httpUrl', () => {
      it('should return the full url to recover the dojo events', () => {
        const vm = vueUnitHelper(IcsLink);
        vm.url = '/banana';
        expect(vm.httpUrl).to.match(/http:\/\/localhost:(\d)+\/banana/);
      });
    });
    describe('webcalUrl', () => {
      it('should return the full url to load using webcal', () => {
        const vm = vueUnitHelper(IcsLink);
        vm.url = '/banana';
        expect(vm.webcalUrl).to.match(/webcal:\/\/localhost:(\d)+\/banana/);
      });
    });
  });
  describe('methods', () => {
    describe('toClipboard', () => {
      it('should focus the input field and copy its content', () => {
        const vm = vueUnitHelper(IcsLink);
        vm.$refs = {
          httpUrl: {
            focus: sandbox.stub(),
            select: sandbox.stub(),
          },
        };
        vm.toggleCopy = sandbox.stub();
        const spy = sandbox.spy(document, 'execCommand');
        vm.toClipboard();
        expect(vm.$refs.httpUrl.focus).to.have.been.calledOnce;
        expect(vm.$refs.httpUrl.select).to.have.been.calledOnce;
        expect(spy).to.have.been.calledWith('copy');
        expect(vm.toggleCopy).to.have.been.calledOnce;
      });
    });
    describe('toggleCopy', () => {
      it('should switch copy over a 2 second period', (done) => {
        const vm = vueUnitHelper(IcsLink);
        vm.copied = false;
        vm.toggleCopy();
        expect(vm.copied).to.be.true;
        setTimeout(() => {
          expect(vm.copied).to.be.false;
          done();
        }, 2000);
      }).timeout(3000);
    });
  });
});
