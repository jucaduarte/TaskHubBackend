import { useEffect, useState } from 'react';
import { getLatLonByIP, getWeatherByLatLon } from '../services/weatherConsult';

function WeatherAPI() {
    const [weather, setWeather] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // latitude e longitude pelo IP - uma aproximação - e depois buscar o clima
        getLatLonByIP()
            .then(({ lat, lon, city }) => 
                getWeatherByLatLon(lat, lon).then((data) => ({ ...data, city }))
            )
            .then(setWeather)
            .catch((err) => setError(err.message));
    }, []);

    if (error)
        return (<>{console.log(error)}</>);

    if (!weather) return <div>Carregando...</div>;

    return (
        <div>
            <div style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {weather.city || weather.name} | {weather.weather?.[0]?.description} | {weather.main?.temp}°C
            </div>
        </div>
    );
}

export default WeatherAPI;