//TODO Revisit and refactor in next sprint to support custom points, probably make it custom points creator
export default class ImageMarker {
  constructor(map) {
    this.map = map;
  }

  addImage = (lat, lng, action) => {
    const imageUrl =
      action === 'add'
        ? require('../../assets/addAction.png')
        : require('../../assets/removeAction.png');

    this.map.loadImage(imageUrl, (error, image = null) => {
      if (image && !this.map.getSource('imageSource')) {
        this.map.addImage('customImage', image);
        this.map.addSource('imageSource', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [lat, lng]
                }
              }
            ]
          }
        });
        this.map.addLayer({
          id: 'imageLayer',
          type: 'symbol',
          source: 'imageSource',
          layout: {
            'icon-image': 'customImage',
            'icon-size': 0.5
          }
        });
      }
    });
  };

  removeImage = () => {
    this.map.removeImage('customImage');
    this.map.removeLayer('imageLayer');
    this.map.removeSource('imageSource');
  };
}
