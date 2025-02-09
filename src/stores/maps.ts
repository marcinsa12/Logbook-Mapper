import { defineStore } from 'pinia'
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM' 

export const useMapsStore = defineStore({
    id: 'Maps',
    state: () => ({
      map: new Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      })
      }),
      getters: {
        
      }
})