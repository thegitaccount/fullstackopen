import axios from 'axios'
import { useEffect, useState } from "react"

const Weather = ({ city }) => {
    const [weather, setWeather] = useState('')

    useEffect(() => {
        const api_key = process.env.REACT_APP_API_KEY
        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`)
            .then((response) => {
                setWeather(response.data)
            })
    }, [])

    console.log("weather", weather)
    return (
        <div>
            <h3>Weather in {city}</h3>
            {weather && (
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>Temperature</td>
                                <td>{weather.main.temp} °C</td>
                            </tr>
                            <tr>
                                <td>Wind</td>
                                <td>{weather.wind.speed} m/s</td>
                            </tr>
                            <tr>
                                <td>Feels like</td>
                                <td>{weather.main.feels_like} °C</td>
                            </tr>
                            <tr>
                                <td>Humidity</td>
                                <td>{weather.main.humidity} %</td>
                            </tr>
                            <tr>
                                <td>Description</td>
                                <td>{weather.weather[0].description}</td>
                            </tr>
                            <tr>
                                <td>
                                    <img alt="weather icon" src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} width="140" height="140"/>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                </div>
            )}
        </div>
    )
}

export default Weather
