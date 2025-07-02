export function metersToKilometers (visibilityInMeters: number) :string {
    const visibilityInKilometers = visibilityInMeters / 100;
    return `${visibilityInKilometers.toFixed(0)}km`;
}