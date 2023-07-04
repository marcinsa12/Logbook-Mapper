import { defineStore } from 'pinia'
import airportDatabase from '@/data/airportDatabase.json' assert {type: 'json'};
import { isIsoDate, createHeaderFromKey } from '@/helpers/time'
import firebase from '@/configs/firebase'
import authUser from '@/configs/googleAuth'
import { getDatabase, ref, child, get } from 'firebase/database'
import { isType } from '@/helpers/flight';

const defaultHeaders = ['date', 'arrival', 'departure', 'aircraftType', 'aircraftReg', 'totalTime'];

export const useLogbookStore = () => {
  const ls = defineStore({
    id: 'Logbook',
    state: () => ({
      fetchInProgress: false,
      authInProgress: false,
      flights: [],
      headersToDisplay: null,
      airports: airportDatabase as any,
      googleAuthUser: null,
      googleAuthToken: null,
    }),
    actions: {
      fetchFlights() {
        if(!this.fetchInProgress) {
          this.fetchInProgress = true
          const db = getDatabase(firebase)
          console.log('Fetching FLIGHTS from Firebase ...')
          const flightsRef = ref(db, '/flights')
          get(flightsRef).then((snapshot) => {
            let id = 0
            const flights = snapshot.val().map((le: any) => {
              le.id = id;
              id++
              Object.keys(le).forEach(key => {
                const val = le[key as keyof Flight]
                if (typeof val === 'string' && isIsoDate(val)) {
                  le[key as keyof Flight] = new Date(val);
                }
              })
              return le
            })
            this.flights = flights
            this.fetchInProgress = false
          })
        }
      },
      setFlights(flights: any) {
        let id = 0
        this.flights = flights.map((le: any) => {
          le.id = id;
          id++
          Object.keys(le).forEach(key => {
            const val = le[key as keyof Flight]
            if (typeof val === 'string' && isIsoDate(val)) {
              le[key as keyof Flight] = new Date(val);
            }
          })
        })
      },
      sortFlightArray({ sortBy }: any) {
        let flights = this.flights      
        if(sortBy) {
          sortBy = sortBy[0]
          const {key, order} = sortBy || {};
          const sortedFlights = flights.sort((a, b) => {
            const valueA = a[key];
            const valueB = b[key];
    
            if (order === 'asc') {
              if (valueA < valueB) return -1;
              if (valueA > valueB) return 1;
            } else if (order === 'desc') {
              if (valueA > valueB) return -1;
              if (valueA < valueB) return 1;
            }
    
            return 0;
          });
          this.flights = sortedFlights;
        }
      },
    },
    getters: {
      getFlights: (state) => {
        return ((start: number, end: number) => state.flights.slice(start, end))
      },
      getAirportByIcaoCode: (state) => {
        return ((code: string) => state.airports.find((airport: any) => airport.icaoCode === code))
      },
      aircraftTypes: state => state.flights.reduce((pv: any, nv: any) => {
        !pv.includes(nv.aircraftType) && pv.push(nv.aircraftType)
        return pv;
      }, []),
      aircraftRegs: state => state.flights.reduce((pv, nv) => {
        !pv.includes(nv.aircraftReg) && pv.push(nv.aircraftReg)
        return pv;
      }, []),
  
  
      flightsNo: (state) => state.flights.length,

      flightsToDisplay: (state) => {
        return (filters) => {
          let fts = state.flights
          if(filters) {
            let filterKeys = Object.keys(filters)
            if(filterKeys.length) {
              fts = fts.filter( flight => {
                let res = false
                filterKeys.forEach( key => {
                  if(key == 'flightType') {
                    if(isType(flight, filters[key])) {
                      res = true
                    }
                  } else {
                    if(filters[key].includes(flight[key])) {
                      res = true
                    }
                  }
                })
                return res
              })
            }
          }
          return fts
        }
      },
  
      landings: (state) => state.flights.reduce((pv, nv) => {
        let { landingDay, landingNight } = nv
        pv.total += (landingDay || 0) + (landingNight || 0)
        pv.day += landingDay || 0
        pv.night += landingNight || 0
        return pv
      }, { total: 0, day: 0, night: 0 }) as Landings,
  
      headers: (state) => {
        return ((defaultOnly: boolean = false) => [
          ...Object.keys(state.flights[0] || {}).filter(k => defaultOnly ? defaultHeaders.includes(k) : true).map(k => {
            return {
              title: createHeaderFromKey(k),
              key: k,
              align: 'start',
              default: defaultHeaders.includes(k)
            }
          })
        ])
      }
    }
  });
  const s = ls()
  if(s.flights.length == 0) {
    if(s.googleAuthUser && s.googleAuthToken) {
      s.fetchFlights()
    } else {
      if(!s.authInProgress) {
        s.authInProgress = true
        
        authUser().then( (results: any) => {
          const { token, user } = results
          s.googleAuthToken = token
          s.googleAuthUser = user
          s.authInProgress = false
          s.fetchFlights()
        });
      }
    }
  }
  return s;
} 
