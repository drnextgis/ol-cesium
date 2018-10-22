/**
 * @module examples.main
 */
const exports = {};

import OLCesium from 'olcs/OLCesium.js';
import olView from 'ol/View.js';
import {defaults as olControlDefaults} from 'ol/control.js';
import olSourceImageWMS from 'ol/source/ImageWMS.js';
import olSourceOSM from 'ol/source/OSM.js';
import olLayerImage from 'ol/layer/Image.js';
import olLayerTile from 'ol/layer/Tile.js';
import olMap from 'ol/Map.js';
import olSourceTileWMS from 'ol/source/TileWMS.js';

let imageWMSSource = new olSourceImageWMS({
        url: 'http://rykovd.nextgis.com/api/component/render/image',
        params: {
          'resource': 172
        },
        ratio: 1,
        imageLoadFunction: function(image, src) {
          var url = src.split("?")[0];
          var query = src.split("?")[1];
          var queryObject = Qs.parse(query);
          url = url + "?resource=" + queryObject.resource +
                      "&extent=" + queryObject.BBOX +
                      "&size=" + queryObject.WIDTH + "," + queryObject.HEIGHT;

          if (image) { image.getImage().src = url; }
          return url;
        }
});

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0MzAyNzUyYi0zY2QxLTQxZDItODRkOS1hNTA3MDU3ZTBiMDUiLCJpZCI6MjU0MSwiaWF0IjoxNTMzNjI1MTYwfQ.oHn1SUWJa12esu7XUUtEoc1BbEbuZpRocLetw6M6_AA';
const ol2d = new olMap({
  layers: [
    new olLayerTile({
      source: new olSourceOSM()
    }),
    new olLayerImage({
      source: imageWMSSource
    })
  ],
  controls: olControlDefaults({
    attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
      collapsible: false
    })
  }),
  target: 'map',
  view: new olView({
    center: [-10967567.978507737, 4204193.972847062],
    zoom: 3
  })
});

const ol3d = new OLCesium({
  map: ol2d,
  time() {
    return Cesium.JulianDate.now();
  }
});
const scene = ol3d.getCesiumScene();
scene.terrainProvider = Cesium.createWorldTerrain();
ol3d.setEnabled(true);

document.getElementById('enable').addEventListener('click', () => ol3d.setEnabled(!ol3d.getEnabled()));

export default exports;
