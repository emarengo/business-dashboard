export default class OfflineReason {
  icon = '';
  name = '';
  name_en = '';
  description = '';
  description_en = '';
  code = '';
  id = null;
  _id = crypto.getRandomValues(new Uint32Array(1))[0];
  active = true;
  saved = false;

  constructor(index = -1, props) {
    this.index = index;

    if (props) return this.clone(props);
  }

  clone(reason) {
    Object.keys(this).forEach(prop => {
      if (typeof reason[prop] !== 'undefined') this[prop] = reason[prop];
    });

    return this;
  }

  prop(name) {
    return this[name];
  }

  update(name, value) {
    this[name] = value;
  }

  isEmptyProp(name) {
    return !this[name];
  }

  isEmpty() {
    return !Object.entries(this).some(
      ([prop, value]) =>
        prop !== 'active' &&
        prop !== 'index' &&
        prop !== '_id' &&
        prop !== 'saved' &&
        Boolean(value) !== false
    );
  }

  isValid() {
    return (
      Object.entries(this).filter(
        ([prop, value]) =>
          prop !== 'active' &&
          prop !== 'index' &&
          prop !== 'id' &&
          prop !== '_id' &&
          prop !== 'saved' &&
          Boolean(value) === false
      ).length === 0
    );
  }
}
