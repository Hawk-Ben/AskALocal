export function toLocalDateTime(date: string) {
    const value = new Date(date)
    const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
}

export function readCoordinates(longitude: string, latitude: string): [number, number] {
    const lng = Number(longitude)
    const lat = Number(latitude)
    if (
        !longitude.trim() || !latitude.trim() ||
        !Number.isFinite(lng) || !Number.isFinite(lat) ||
        lng < -180 || lng > 180 || lat < -90 || lat > 90
    ) {
        throw new Error('Enter longitude between -180 and 180 and latitude between -90 and 90.')
    }
    return [lng, lat]
}
