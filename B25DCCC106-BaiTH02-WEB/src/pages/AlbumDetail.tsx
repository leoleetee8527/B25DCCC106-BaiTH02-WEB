import { useEffect, useState } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import type { WeatherResponse, LayoutContextType } from '../types';
import {
  CITIES,
  fetchWeather,
  getWeatherInfo,
  getWeatherBackground,
  formatTemp,
  formatUpdateTime,
  getDayOfWeek,
  formatDate,
} from '../api/weather';

function AlbumDetail() {
  const { cityName } = useParams<{ cityName: string }>();
  const { unit, setBackground } = useOutletContext<LayoutContextType>();
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const decodedName = cityName ? decodeURIComponent(cityName) : '';
  const city = CITIES.find(
    (c) => c.name.toLowerCase() === decodedName.toLowerCase()
  ) || CITIES[0];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchWeather(city)
      .then((data) => {
        if (isMounted) {
          setWeatherData(data);
          setBackground(getWeatherBackground(data.current.weather_code));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [city, setBackground]);

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div className="detail-header">
          <Link to="/" className="back-link">
            ← Quay lại trang chủ
          </Link>
          <h2 className="detail-title">📍 Chi tiết thời tiết: {city.name}</h2>
          <p className="detail-coords">
            Tọa độ: Vĩ độ {city.lat}°N - Kinh độ {city.lon}°E
          </p>
        </div>

        {loading && (
          <div className="state-placeholder">
            <div className="loading-spinner" />
            <p className="state-text">Đang tải dữ liệu chi tiết cho {city.name}...</p>
          </div>
        )}

        {error && (
          <div className="state-placeholder">
            <span className="state-icon">⚠️</span>
            <p className="state-text">{error}</p>
          </div>
        )}

        {!loading && !error && weatherData && (
          <div className="detail-body">
            <div className="detail-current">
              <span className="detail-icon">
                {getWeatherInfo(weatherData.current.weather_code).icon}
              </span>
              <div>
                <div className="detail-temp">
                  {formatTemp(weatherData.current.temperature_2m, unit)}
                </div>
                <div className="detail-desc">
                  {getWeatherInfo(weatherData.current.weather_code).description}
                </div>
                <div className="detail-time">
                  Cập nhật: {formatUpdateTime(weatherData.current.time)}
                </div>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-stat-box">
                <span className="detail-stat-icon">💧</span>
                <span className="detail-stat-title">Độ ẩm tương đối</span>
                <span className="detail-stat-val">
                  {weatherData.current.relative_humidity_2m}%
                </span>
              </div>
              <div className="detail-stat-box">
                <span className="detail-stat-icon">💨</span>
                <span className="detail-stat-title">Tốc độ gió (10m)</span>
                <span className="detail-stat-val">
                  {weatherData.current.wind_speed_10m} km/h
                </span>
              </div>
              <div className="detail-stat-box">
                <span className="detail-stat-icon">🌡️</span>
                <span className="detail-stat-title">Nhiệt độ cao nhất hôm nay</span>
                <span className="detail-stat-val">
                  {formatTemp(weatherData.daily.temperature_2m_max[0], unit)}
                </span>
              </div>
              <div className="detail-stat-box">
                <span className="detail-stat-icon">❄️</span>
                <span className="detail-stat-title">Nhiệt độ thấp nhất hôm nay</span>
                <span className="detail-stat-val">
                  {formatTemp(weatherData.daily.temperature_2m_min[0], unit)}
                </span>
              </div>
            </div>

            <h3 className="forecast-heading">📅 Diễn biến 7 ngày</h3>
            <div className="detail-forecast-cards">
              {weatherData.daily.time.map((d, i) => {
                const info = getWeatherInfo(weatherData.daily.weather_code[i]);
                return (
                  <div key={d} className="mini-card">
                    <span className="mini-day">{getDayOfWeek(d)}</span>
                    <span className="mini-date">{formatDate(d)}</span>
                    <span className="mini-icon">{info.icon}</span>
                    <span className="mini-temp-max">
                      ↑ {formatTemp(weatherData.daily.temperature_2m_max[i], unit)}
                    </span>
                    <span className="mini-temp-min">
                      ↓ {formatTemp(weatherData.daily.temperature_2m_min[i], unit)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlbumDetail;

