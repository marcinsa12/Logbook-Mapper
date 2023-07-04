export {};
declare global {

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
    id: string,
    date: Date,
    departure: string,
    departureTime: Date,
    arrival: string,
    arrivalTime: Date,
    aircraftType: string,
    aircraftReg: string,
  
    singleEngineTime: Date,
    multiEngineTime: Date,
    multiPilotTime: Boolean,
  
    totalTime: Date,
    
    captain: string,
  
    takeOffsDay: number,
    landingDay: number,
    takeOffsNight: number,
    landingNight: number,
    
    nightTime: Date,
    ifrTime: Date,
    pic: Date,
    sic: Date,
    dual: Date,
    instructor: Date,
  
    remarks: string
  }
}