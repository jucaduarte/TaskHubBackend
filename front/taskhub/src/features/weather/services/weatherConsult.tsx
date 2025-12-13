const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function getWeatherByLatLon(lat: number, lon: number) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Não foi possível obter o clima.');
    }
    return response.json();
}

export async function getLatLonByCity(city: string) {
    const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
    );
    if (!response.ok) {
        throw new Error('Não foi possível obter a localização.');
    }
    const data = await response.json();
    if (!data.length) throw new Error('Não foi possível obter a localização.');
    return { lat: data[0].lat, lon: data[0].lon };
}

export async function getLatLonByIP() {
    const response = await fetch('http://ip-api.com/json/');
    if (!response.ok) {
        throw new Error('Não foi possível obter a localização.');
    }
    const data = await response.json();
    return { lat: data.lat, lon: data.lon, city: data.city };
}

export async function getWeatherByCity(city: string, countryCode?: string) {
    const query = countryCode ? `${city},${countryCode}` : city;
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric&lang=pt_br`
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Não foi possível obter o clima.');
    }
    return response.json();
}