import { defineStore } from 'pinia'
//import airportDatabase from '@/data/airportDatabase.json' assert {type: 'json'};
import { isIsoDate } from '@/helpers/time'
import firebase from '@/configs/firebase'
import authUser from '@/configs/googleAuth'
import { getDatabase, ref, get, set } from 'firebase/database'
import { isType, headers } from '@/helpers/flight';
import { fetchAirport, calculateDistance } from '@/helpers/airports';

export const useLogbookStore = (): LogbookStore => {
  const ls = defineStore({
    id: 'Logbook',
    state: () => ({
      fetchInProgress: false,
      authInProgress: false,
      googleAuthUser: null,
      googleAuthToken: null,

      flights: [] as Flight[],
      airports: {} as { [key: string]: Airport },
      headers: headers,
      headersToDisplay: headers.filter(h => h.default),

      activeFlightFilters: {} as { [key: string]: any },
    }),
    actions: {
      async pushFlight(flight: Flight) {
        const db = getDatabase(firebase)
        const flightsRef = ref(db, `/flights2/${flight.id}`)
        await set(flightsRef, flight)
        await this.fetchFlights()
      },
      async fetchFlights() {
        if (!this.fetchInProgress) {
          this.fetchInProgress = true
          const db = getDatabase(firebase)
          console.log('Fetching FLIGHTS from Firebase ...')
          const flightsRef = ref(db, '/flights2')
          const snapshot = await get(flightsRef)
          const flights = snapshot.val() as Flight[] | null
          if (Array.isArray(flights)) {
            this.flights = flights
          }
          this.fetchInProgress = false
        }
      },
      async fetchAirports(): Promise<void> {
        if (!this.fetchInProgress) {
          this.fetchInProgress = true

          console.log('Fetching AIRPORTS from Firebase ...')
          this.airports = await fetchAirport()

          this.fetchInProgress = false
        }
      },
      setFlightFilters(filters: Record<string, any>): void {
        this.activeFlightFilters = filters;
      },
      clearFilters() {
        this.activeFlightFilters = null;
      }
    },
    getters: {
      getFlight: (state) => {
        return ((id: number) => {
          return state.flights.find(f => f.id === id) 
        })
      },
      getAirportByIcaoCode: (state) => {
        return ((code: string) => state.airports[code] || (async () => {
          let airport = await fetchAirport(code)
          state.airports[code] = airport;
          return airport
        })())
      },
      aircraftTypes: (state): AircraftType[] => state.flights.reduce((pv: any, nv: any) => {
        !pv.includes(nv.aircraftType) && pv.push(nv.aircraftType)
        return pv;
      }, []),
      aircraftRegs: (state): AircraftRegs[] => state.flights.reduce((pv: any, nv: any) => {
        !pv.includes(nv.aircraftReg) && pv.push(nv.aircraftReg)
        return pv;
      }, []),


      flightsNo: (state) => state.flights.length as number,

      flightsToDisplay(state): Flight[] {
        let filters = state.activeFlightFilters
        let fts = state.flights || []
        if (filters) {
          let filterKeys = Object.keys(filters)
          if (filterKeys.length) {
            fts = fts.filter(flight => {
              let res = true
              filterKeys.forEach((key: string) => {
                if (key == 'flightType') {
                  if (!isType(flight, filters[key])) {
                    res = false
                  }
                } else if (key === 'dateFrom') {
                  // Check if the flight's date is after or equal to the 'dateFrom' filter value
                  if (new Date(flight.date) < new Date(filters[key])) {
                    res = false;
                  }
                } else if (key === 'dateTo') {
                  // Check if the flight's date is before or equal to the 'dateTo' filter value
                  if (new Date(flight.date) > new Date(filters[key])) {
                    res = false;
                  }
                } else if (key === 'picOnly') {
                  if (filters[key] && !flight.pic) {
                    res = false;
                  }
                } else if( key === 'nightOnly') {
                  if (filters[key] && !flight.nightTime) {
                    res = false;
                  }
                } else {
                  if (!filters[key].includes(flight[key])) {
                    res = false
                  }
                }
              })
              return res
            })
          }
        }
        return fts
      },
      landings: (state) => state.flights.reduce((pv, nv) => {
        let { landingDay, landingNight } = nv
        pv.total += (landingDay || 0) + (landingNight || 0)
        pv.day += landingDay || 0
        pv.night += landingNight || 0
        return pv
      }, { total: 0, day: 0, night: 0 }) as Landings,
      totalFlownDistance(state): number {
        return this.flightsToDisplay?.reduce((pv: any, nv: any) => {
          const { departure, arrival } = nv;
          let distance = calculateDistance(
            Number(state.airports[departure]?.lat),
            Number(state.airports[departure]?.lon),
            Number(state.airports[arrival]?.lat),
            Number(state.airports[arrival]?.lon)
          ) as number;
          return pv + distance
        }, 0)
      }
    }
  });
  const s = ls()
  if (s.flights.length == 0) {
    if (s.googleAuthUser && s.googleAuthToken) {
      s.fetchFlights()
    } else {
      if (!s.authInProgress) {
        s.authInProgress = true

        authUser().then((results: any) => {
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
