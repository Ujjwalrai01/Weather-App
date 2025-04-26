import { useState, useEffect } from "react";
import "./App.css";

const WeatherApp = () => {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [background, setBackground] = useState("default");

  const apiKey = "38a19b3b403447598ba53326252801";

  const fetchWeather = async (e) => {
    e.preventDefault();
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;
    console.log(apiUrl);

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error.message || "Failed to fetch weather data"
        );
      }
      const data = await response.json();
      console.log(data);

      setWeatherData(data);
      setError(null);

      const condition = data.current.condition.text.toLowerCase();
      if (condition.includes("rain")) {
        setBackground("rainy");
      } else if (condition.includes("cloud")) {
        setBackground("cloudy");
      } else if (condition.includes("sun") || condition.includes("clear")) {
        setBackground("sunny");
      } else {
        setBackground("default");
      }
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    }
  };

  return (
    <div className={`weather-container ${background}`}>
      <form onSubmit={fetchWeather}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          required
        />
        <button type="submit">Get Weather</button>
      </form>

      {error && <div className="error">Error: {error}</div>}

      {weatherData && (
        <div className="weather-card">
          <h2>
            {weatherData.location.name}, {weatherData.location.country}
          </h2>
          <p>Temperature: {weatherData.current.temp_c}°C</p>
          {/* <p>Feels Like: {weatherData.current.feelslike_c}°C</p> */}
          <p>Condition: {weatherData.current.condition.text}</p>
          {/* <p>Icons: {weatherData.current.condition.icon}</p> */}
          <img
            src={weatherData.current.condition.icon}
            alt={weatherData.current.condition.text}
            className="weather-icon"
          />
          <p>Humidity: {weatherData.current.humidity}%</p>
          <p>Wind Speed: {weatherData.current.wind_kph} km/h</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
