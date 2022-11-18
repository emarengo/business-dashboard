export default class Colonia {
  constructor(map, previousId = null) {
    this.map = map;
    this.previousId = previousId;
  }

  getId = () => this.previousId;

  onMouseOver = (id, source, callback) => {
    // Before move to next highlighted cityArea, reset previous state
    if (this.previousId) {
      this.map.setFeatureState(
        { source, id: this.previousId },
        { selected: false }
      );
    }

    // Highlight current cityArea
    this.map.setFeatureState({ source, id }, { selected: true });
    this.previousId = id;

    if (callback) {
      callback(this.map);
    }
  };
}
