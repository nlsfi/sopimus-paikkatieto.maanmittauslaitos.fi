import 'ol/ol.css';
import apply from 'ol-mapbox-style';
import Map from 'ol/Map';
import Hash from './hash';
import GeoJSON from 'ol/format/GeoJSON';

import { features } from './features';
import { transform } from 'ol/proj';

// Note! Add api-key to ./style.json
import featuresStyle from './style.json';

// Note! proxy with credentials is required to access https://sopimus-paikkatieto.maanmittauslaitos.fi/kiinteisto-avoin/simple-features/v3

const apiVer = 'v3',
  apiVerUrl = `https://<your-own-proxy-url>/kiinteisto-avoin/simple-features/${apiVer}`,
  batchSize = 1000;

const
  colls = [
    {
      featType: 'RajamerkinSijaintitiedot', selected: true
    },
    {
      featType: 'KiinteistorajanSijaintitiedot', selected: true
    }
  ];

const
  hash = new Hash(),
  map = new Map({ target: 'map' }),
  format = new GeoJSON({
    featureProjection: 'EPSG:3857',
    dataProjection: 'EPSG:4326'
  });

hash.addTo(map);


apply(map, featuresStyle).then((map) => {
  return map;
}).then((map) => {
  map.on("moveend", (evt) => {
    reloadFeatures(map);
  });
});

function reloadFeatures(map) {
  const
    view = map.getView(),
    layer = map.getLayers().getArray()[1],
    source = layer.getSource(),
    bounds = view.calculateExtent(map.getSize()),
    lb = transform([bounds[0], bounds[1]], 'EPSG:3857', 'EPSG:4326'),
    rt = transform([bounds[2], bounds[3]], 'EPSG:3857', 'EPSG:4326'),
    bbox = [lb[0], lb[1], rt[0], rt[1]],
    bboxStr = bbox.join(',');

  source.clear();

  if (map.getView().getZoom() >= 14) {
    colls.filter(coll => coll.selected).forEach(coll => {
      const featType = coll.featType, url = apiVerUrl;

      features((fc) => {
        const feats = format.readFeatures(fc);

        feats.forEach(f => {
          applyUniqueId(f, featType, apiVer);
        }
        );
        source.addFeatures(feats);
        return true;
      }, url, featType, {
        limit: batchSize,
        bbox: bboxStr
      });
    });
  }
}

function applyUniqueId(f, featType, api) {
  f.setId(`${featType}_${api}_${f.getId()}`);
  f.setProperties({ 'api': api, 'featureType': featType });

}
