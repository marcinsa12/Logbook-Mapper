import Feature from 'ol/Feature.js';
import VectorLayer from 'ol/source/Vector.js';
import { LineString, Point, Polygon } from 'ol/geom.js';
import { Vector } from 'ol/layer'
import { Style, Icon, Fill, Circle } from 'ol/style'
import Stroke from 'ol/style/Stroke';
import { getCenter } from 'ol/extent';
import { fromLonLat } from 'ol/proj';
import arrowIcon from '@/assets/iconArrowRight.svg'

async function drawLineWithArrow(from: any, to: any, map: any) {
    if (!map) {
        console.warn('Map not available for drawing');
        return;
    }

    return new Promise((resolve, reject) => {
        try {
            const fromResult = [from];
            const toResult = [to];

            if (fromResult.length > 0 && toResult.length > 0) {
                const fromCoords = fromLonLat([fromResult[0].lon, fromResult[0].lat]);
                const toCoords = fromLonLat([toResult[0].lon, toResult[0].lat]);
                const { vectorSource, vectorLayer } = drawLine(fromCoords, toCoords)
                const { arrowSource, arrowLayer } = drawArrow(fromCoords, toCoords)
                addCircleFeature(vectorSource, fromCoords)
                map.addLayer(vectorLayer);
                map.addLayer(arrowLayer);

                const extent = vectorSource.getExtent();
                const maxZoom = 16;

                const mapSize = map.getSize();
                const zoom = map.getView().getZoomForResolution(map.getView().getResolutionForExtent(extent, mapSize));
                const center = getCenter(extent);
                const limitedZoom = Math.min(zoom, maxZoom);

                map.getView().fit(extent, { mapSize, maxZoom: limitedZoom, padding: [50, 50, 50, 50] });
                resolve(true);
            } else {
                reject(new Error('Invalid input'));
            }
        } catch (error) {
            reject(error);
        }
    });
}

function drawLine(fromCoords: any, toCoords: any) {
    const line = new Feature({
        geometry: new LineString([fromCoords, toCoords]),
    });

    const lineStyle = new Style({
        stroke: new Stroke({
            color: 'blue',
            width: 2
        })
    })

    line.setStyle(lineStyle)

    const vectorSource = new VectorLayer({
        features: [line],
    });

    const vectorLayer = new Vector({
        source: vectorSource,
    });

    return {
        vectorSource,
        vectorLayer
    }
}

function drawArrow(fromCoords: any, toCoords: any) {
    const dx = toCoords[0] - fromCoords[0];
    const dy = toCoords[1] - fromCoords[1];
    const rotation = Math.atan2(dy, dx);
    const arrow = new Feature({
        geometry: new Point(toCoords),
      });

    const arrowStyle = new Style({
    image: new Icon({
        src: arrowIcon,
        anchor: [0.75, 0.5],
        rotateWithView: true,
        rotation: -rotation,
        scale: .05
    }),
    });

    arrow.setStyle(arrowStyle);
    const arrowSource = new VectorLayer({
        features: [arrow],
      });

    const arrowLayer = new Vector({
        source: arrowSource,
    });
    return { arrowSource, arrowLayer };
}

function addCircleFeature(vectorSource: any, fromAddress: any) {
    const circleStyle = new Style({
      image: new Circle({
        fill: new Fill({
          color: 'red',
        }),
        stroke: new Stroke({
          color: 'white',
          width: 3, // adjust this value to make the circle border thicker
        }),
        radius: 7, // adjust this value to change the size of the circle
      }),
    });
  
    const circleGeom = new Point(fromAddress);
  
    const circleFeature = new Feature({
      geometry: circleGeom,
    });
  
    circleFeature.setStyle(circleStyle);
  
    vectorSource.addFeature(circleFeature);
  }

export { drawLineWithArrow, drawArrow, drawLine }