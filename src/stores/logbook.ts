import { defineStore } from 'pinia'
//import airportDatabase from '@/data/airportDatabase.json' assert {type: 'json'};
import { isIsoDate } from '@/helpers/time'
import firebase from '@/configs/firebase'
import authUser from '@/configs/googleAuth'
import { getDatabase, ref, get, set } from 'firebase/database'
import { isType, headers } from '@/helpers/flight';
import { fetchAirport, calculateDistance } from '@/helpers/airports';

export const useLogbookStore = defineStore({
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
    activeFlightFilters: null as { [key: string]: any } | null,
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
      return (id: number): Flight | undefined => {
        return state.flights.find(f => f.id === id)
      }
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
      const filters = state.activeFlightFilters
      let fts = state.flights || []
      
      if (filters && Object.keys(filters).length > 0) {
        fts = fts.filter(flight => {
          return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;

            switch(key) {
              case 'flightType':
                return isType(flight, value);
              case 'dateFrom':
                return new Date(flight.date) >= new Date(value);
              case 'dateTo':
                return new Date(flight.date) <= new Date(value);
              case 'picOnly':
                return !value || !!flight.pic;
              case 'nightOnly':
                return !value || !!flight.nightTime;
              default:
                return Array.isArray(value) && value.includes(flight[key]);
            }
          });
        });
      }
      
      return fts;
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
}) 
