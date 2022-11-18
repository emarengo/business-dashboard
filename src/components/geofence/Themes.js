export default {
  cityAreas: {
    areaLayer: {
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          'rgba(41, 104, 131, 0.55)',
          'rgba(0, 0, 0, 0)'
        ]
      }
    },
    borderLayer: {
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#093548',
          'rgba(9,53,72,0.28)'
        ],
        'line-width': 1.5
      }
    }
  },
  partnersAreas: {
    areaLayer: {
      paint: {
        'fill-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#64bdbb',
          'rgba(41, 104, 131, 0.55)'
        ]
      }
    },
    borderLayer: {
      paint: {
        'line-color': '#29d1d9',
        'line-width': 1.5
      }
    }
  },
  cityAreasEdit: {
    areaLayer: {
      paint: {
        'fill-color': 'rgba(238, 240, 245, 0.6)'
      }
    },
    borderLayer: {
      paint: {
        'line-color': '#093548',
        'line-width': 1,
        'line-dasharray': [0.5, 2]
      }
    },
    borderLayerNoDots: {
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#0e8e97',
          'rgba(247,249,254,0)'
        ],
        'line-width': 3
      }
    },
    borderLayerFilters: {
      paint: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'filterOn'], false],
          '#0e8e97',
          'rgba(247,249,254,0)'
        ],
        'line-width': 1.5
      }
    }
  },
  drawTool: [
    //polygon fill on drawing
    {
      id: 'gl-draw-polygon-fill',
      type: 'fill',
      filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
      paint: {
        'fill-color': 'rgba(9, 53, 72, 0.12)',
        'fill-opacity': 1
      }
    },
    // polygon outline stroke
    {
      id: 'gl-draw-polygon-stroke-active',
      type: 'line',
      paint: {
        'line-color': '#0a646e',
        'line-width': 2,
        'line-dasharray': [5, 6]
      }
    },
    {
      id: 'gl-draw-polygon-and-line-vertex-halo-active',
      filter: [
        'all',
        ['==', 'meta', 'vertex'],
        ['==', '$type', 'Point'],
        ['!=', 'mode', 'static']
      ],
      type: 'circle',
      paint: {
        'circle-radius': 6,
        'circle-color': '#057982'
      }
    },
    {
      id: 'gl-draw-polygon-and-line-vertex-active',
      type: 'circle',
      paint: {
        'circle-radius': 5,
        'circle-color': '#EEF0F5'
      }
    }
  ]
};
