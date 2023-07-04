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
    function inc(t) {
        return type.includes(t)
    }
}
 
export { isType }



