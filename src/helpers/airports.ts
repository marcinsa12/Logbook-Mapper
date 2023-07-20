import firebase from '@/configs/firebase'
import { getDatabase, ref, get } from 'firebase/database'

async function fetchAirport(icaoCode = null as string | null) {
    const db = getDatabase(firebase)
    let airportsRef = ref(db, '/airports2'.concat(icaoCode ? `/${icaoCode.toUpperCase()}` : ''));
    const dbCon = await get(airportsRef);
    return await dbCon.val()
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    if (!lat1 || !lat2 || !lon1 || !lon2) return 0
    const earthRadiusNM = 3440.065; // Earth's radius in nautical miles

    const toRadians = (value: number) => (value * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusNM * c;
    return distance || 0;
}

export { fetchAirport, calculateDistance }