import { getSunrise, getSunset } from "sunrise-sunset-js";
import { calculateDistance } from "./airports";

function isIsoDate(str: string) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d = new Date(str);
    return d instanceof Date && d.toISOString() === str; // valid date 
}

function createHeaderFromKey(key: string) {
    const result = key.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
}

//write a function to get sunrise and sunset times for a given date, for departure and arrival airports
function getSunriseSunset(date: Date, departure: Airport, arrival: Airport) {
    const departureSunrise = getSunrise(Number(departure.lat), Number(departure.lon), date);
    const departureSunset = getSunset(Number(departure.lat), Number(departure.lon), date);
    const arrivalSunrise = getSunrise(Number(arrival.lat), Number(arrival.lon), date);
    const arrivalSunset = getSunset(Number(arrival.lat), Number(arrival.lon), date);
    return { departureSunrise, departureSunset, arrivalSunrise, arrivalSunset };
}

//Write a function that will loop through the GC positions of the aircraft of the given flight, and will return when the flight becomes a night flight  
function getNightFlightTime(flight: Flight, departure: Airport, arrival: Airport) {
    const { departureTime, arrivalTime } = flight;
    const departureDate = new Date(`${departureTime}Z`);
    const arrivalDate = new Date(`${arrivalTime}Z`);
    const flightDuration = arrivalDate.getTime() - departureDate.getTime();
    console.log(flightDuration)
    const averageSpeed = calculateDistance(Number(departure.lat), Number(departure.lon), Number(arrival.lat), Number(arrival.lon)) / (flightDuration / 3600000);
    let dayFlightTime = 0;
    let nightFlightTime = 0;
    for (let i = 0; i < flightDuration; i += 300000) {
        const position = calculatePosition(departure, arrival, averageSpeed, i, departureDate);
        const isDayOnPoint = isDay(position);
        if (isDayOnPoint) {
            dayFlightTime += 300000;
        } else {
            nightFlightTime += 300000;
        }
    }
    return printTimeFromMilliseconds(nightFlightTime);
}

//write a function to define if there is day or night at a given position and time
function isDay(position: { lat: number; lon: number; time: number }) {
    const { lat, lon, time } = position;
    const pointSunsetTime = getSunset(lat, lon, new Date(time));
    const pointSunriseTime = getSunrise(lat, lon, new Date(time));
    return time < pointSunsetTime.getTime() && time > pointSunriseTime.getTime();
}

function calculatePosition(departure: Airport, arrival: Airport, averageSpeed: number, time: number, departureTime: Date) {
    const distance = averageSpeed * (time / 3600000);
    const departureLat = Number(departure.lat);
    const departureLon = Number(departure.lon);
    const arrivalLat = Number(arrival.lat);
    const arrivalLon = Number(arrival.lon);
    const dLat = arrivalLat - departureLat;
    const dLon = arrivalLon - departureLon;
    const bearing = (Math.atan2(dLon, dLat) * 180) / Math.PI;
    const lat1 = (departureLat * Math.PI) / 180;
    const lon1 = (departureLon * Math.PI) / 180;
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / 3440.065) + Math.cos(lat1) * Math.sin(distance / 3440.065) * Math.cos(bearing * (Math.PI / 180)));
    const lon2 = lon1 + Math.atan2(Math.sin(bearing * (Math.PI / 180)) * Math.sin(distance / 3440.065) * Math.cos(lat1), Math.cos(distance / 3440.065) - Math.sin(lat1) * Math.sin(lat2));
    const lat = (lat2 * 180) / Math.PI;
    const lon = (lon2 * 180) / Math.PI;
    return { lat, lon, time: departureTime.getTime() + time };
}



//write a function which will print HH:MM:SS from a given number of milliseconds
function printTimeFromMilliseconds(milliseconds: number) {
    const hours = Math.floor(milliseconds / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((milliseconds % 3600000) / 60000).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}


export { isIsoDate, createHeaderFromKey, getSunriseSunset, getNightFlightTime }