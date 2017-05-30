import { clone } from 'lodash';

export default {
  _store: {},
  save(key, data) {
    this._store[key] = clone(data);
  },
  load(key) {
    return this._store[key];
  },
  delete(key) {
    delete this._store[key];
  },
};
