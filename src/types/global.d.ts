import 'pinia';
export { };
declare global {
  type AircraftType = string;
  type AircraftRegs = string;

  interface Landings {
    total: number,
    day: number,
    night: number
  }

  interface TableHeader {
    title: string,
    key: string,
    align: string,
    default: boolean
  }

  interface Flight {
    id: number,
    date: string,
    departure: string,
    departureTime: string,
    arrival: string,
    arrivalTime: string,
    aircraftType: string,
    aircraftReg: string,

    singleEngineTime: string,
    multiEngineTime: string,
    multiPilotTime: Boolean,

    totalTime: string,

    captain: string,

    takeOffsDay: number,
    landingDay: number,
    takeOffsNight: number,
    landingNight: number,

    nightTime: string,
    ifrTime: string,
    pic: string,
    sic: string,
    dual: string,
    instructor: string,

    remarks: string
  }

  interface Airport {
    airportName: string,
    city: string,
    country: string,
    iataCode: string | null,
    lat: string,
    lon: string,
    type: string,
    elevation_ft: string | null,
    continent: string
  }

  interface Filter {
    name: string,
    key: string, 
    values: string[]
  }

  // Define state type
  interface LogbookState {
    fetchInProgress: boolean;
    authInProgress: boolean;
    googleAuthUser: any; // Change 'any' to the actual type of googleAuthUser if possible
    googleAuthToken: any; // Change 'any' to the actual type of googleAuthToken if possible
    flights: Flight[];
    airports: { [key: string]: Airport };
    headers: any; // Change 'any' to the actual type of headers if possible
    headersToDisplay: any; // Change 'any' to the actual type of headersToDisplay if possible
    activeFlightFilters: { [key: string]: any };
  }

  // Define actions and getters type
  interface LogbookActions {
    pushFlight: (flight: Flight) => void;
    fetchFlights: () => void;
    fetchAirports: () => Promise<void>;
    setFlightFilters: (filters: Record<string, any>) => void;
  }

  interface LogbookGetters {
    getFlight: (id: number) => Flight[];
    getAirportByIcaoCode: (code: string) => Airport | Promise<Airport>;
    aircraftTypes: AircraftType[];
    aircraftRegs: AircraftRegs[];
    flightsNo: number;
    flightsToDisplay: Flight[];
    landings: Landings;
    totalFlownDistance: number;
  }

  // Define the full store type by merging state, actions, and getters types
  type LogbookStore = LogbookState & LogbookActions & LogbookGetters;
}
