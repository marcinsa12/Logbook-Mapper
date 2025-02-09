function isType(flight: Flight, type: string[]) {
    let isType = false
    
    if(inc('XC')) {
        isType = flight.arrival != flight.departure
        if(isType) {
            return isType;
        }
    }
    if(inc('domestic')) {
        isType = flight.arrival.slice(0,2) === flight.departure.slice(0,2)
        if(isType) {
            return isType;
        }
    }
    if(inc('international')) {
        isType = flight.arrival.slice(0,2) !== flight.departure.slice(0,2)
        if(isType) {
            return isType;
        }
    }
    
    return isType
    function inc(t: string) {
        return type.includes(t)
    }
}

const headers = [
    {
        "title": "Date",
        "key": "date",
        "align": "start",
        "default": true
    },
    {
        "title": "Departure",
        "key": "departure",
        "align": "start",
        "default": true
    },
    {
        "title": "Departure Time",
        "key": "departureTime",
        "align": "start",
        "default": false
    },
    {
        "title": "Arrival",
        "key": "arrival",
        "align": "start",
        "default": true
    },
    {
        "title": "Arrival Time",
        "key": "arrivalTime",
        "align": "start",
        "default": false
    },
    {
        "title": "Aircraft Type",
        "key": "aircraftType",
        "align": "start",
        "default": true
    },
    {
        "title": "Aircraft Reg",
        "key": "aircraftReg",
        "align": "start",
        "default": true
    },
    {
        "title": "Captain",
        "key": "captain",
        "align": "start",
        "default": false
    },
    {
        "title": "Dual",
        "key": "dual",
        "align": "start",
        "default": false
    },
    {
        "title": "Ifr Time",
        "key": "ifrTime",
        "align": "start",
        "default": false
    },
    {
        "title": "Instructor",
        "key": "instructor",
        "align": "start",
        "default": false
    },
    {
        "title": "Landing Day",
        "key": "landingDay",
        "align": "start",
        "default": false
    },
    {
        "title": "Landing Night",
        "key": "landingNight",
        "align": "start",
        "default": false
    },
    {
        "title": "Multi Engine Time",
        "key": "multiEngineTime",
        "align": "start",
        "default": false
    },
    {
        "title": "Multi Pilot Time",
        "key": "multiPilotTime",
        "align": "start",
        "default": false
    },
    {
        "title": "Night Time",
        "key": "nightTime",
        "align": "start",
        "default": false
    },
    {
        "title": "Pic",
        "key": "pic",
        "align": "start",
        "default": false
    },
    {
        "title": "Remarks",
        "key": "remarks",
        "align": "start",
        "default": false
    },
    {
        "title": "Sic",
        "key": "sic",
        "align": "start",
        "default": false
    },
    {
        "title": "Sim Date",
        "key": "simDate",
        "align": "start",
        "default": false
    },
    {
        "title": "Sim Time",
        "key": "simTime",
        "align": "start",
        "default": false
    },
    {
        "title": "Sim Type",
        "key": "simType",
        "align": "start",
        "default": false
    },
    {
        "title": "Single Engine Time",
        "key": "singleEngineTime",
        "align": "start",
        "default": false
    },
    {
        "title": "Take Offs Day",
        "key": "takeOffsDay",
        "align": "start",
        "default": false
    },
    {
        "title": "Take Offs Night",
        "key": "takeOffsNight",
        "align": "start",
        "default": false
    },
    {
        "title": "Total Time",
        "key": "totalTime",
        "align": "start",
        "default": true
    },
    {
        "title": "Id",
        "key": "id",
        "align": "start",
        "default": false
    }
]

const newFlightData = {
    id: "",
    date: null,
    departure: "",
    departureTime: null,
    arrival: "",
    arrivalTime: null,
    aircraftType: "",
    aircraftReg: "",
    singleEngineTime: null,
    multiEngineTime: null,
    multiPilotTime: false,
    totalTime: null,
    captain: "self",
    takeOffsDay: 0,
    landingDay: 0,
    takeOffsNight: 0,
    landingNight: 0,
    nightTime: null,
    ifrTime: null,
    pic: null,
    sic: null,
    dual: null,
    instructor: null,
    remarks: ""
}
 
export { isType, headers, newFlightData }



