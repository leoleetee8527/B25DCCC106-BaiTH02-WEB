import { useState, useEffect, useCallback } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import type { City, WeatherResponse, LayoutContextType } from '../types';
import {
  CITIES,
  fetchWeather,
  getWeatherInfo,
  getWeatherBackground,
  formatTemp,
  formatUpdateTime,
  getDayOfWeek,
  formatDate,
  removeVietnameseTones,
} from '../api/weather';

function Home() {
  const { unit, setBackground } = useOutletContext<LayoutContextType>();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('weather_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (cityName: string) => {
    setFavorites((prev) =>
      prev.includes(cityName)
        ? prev.filter((name) => name !== cityName)
        : [...prev, cityName]
    );
  };

  const isFavorite = (cityName: string) => favorites.includes(cityName);

  const loadWeather = useCallback(
    async (city: City) => {
      setLoading(true);
      setError(null);
      setWeatherData(null);

      try {
        const data = await fetchWeather(city);
        setWeatherData(data);
        setBackground(getWeatherBackground(data.current.weather_code));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    },
    [setBackground]
  );

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    loadWeather(city);
  };

  const handleRetry = () => {
    if (selectedCity) {
      loadWeather(selectedCity);
    }
  };

  const filteredCities = CITIES.filter((city) => {
    if (!searchQuery.trim()) return true;
    return removeVietnameseTones(city.name).includes(
      removeVietnameseTones(searchQuery)
    );
  });

  const sortedCities = [...filteredCities].sort((a, b) => {
    const aFav = isFavorite(a.name) ? 0 : 1;
    const bFav = isFavorite(b.name) ? 0 : 1;
    return aFav - bFav;
  });

  return (
    <div className="home-container">
      <aside className="city-panel">
        <h2 className="panel-title">🏙️ Danh sách thành phố</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm thành phố..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <ul className="city-list">
          {sortedCities.map((city) => {
            const isSelected = selectedCity?.name === city.name;
            const fav = isFavorite(city.name);

            return (
              <li key={city.name} className="city-item">
                <button
                  type="button"
                  className={`city-btn ${isSelected ? 'city-btn--active' : ''}`}
                  onClick={() => handleSelectCity(city)}
                >
                  <span className="city-name">
                    {fav && <span className="star-icon">⭐</span>}
                    {city.name}
                  </span>

                  <span
                    className="fav-toggle"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(city.name);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        toggleFavorite(city.name);
                      }
                    }}
                    title={fav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                  >
                    {fav ? '❤️' : '🤍'}
                  </span>
                </button>
              </li>
            );
          })}
          {sortedCities.length === 0 && (
            <li className="empty-message">Không tìm thấy thành phố phù hợp</li>
          )}
        </ul>
      </aside>

      <section className="weather-panel">
        {!selectedCity && (
          <div className="state-placeholder">
            <span className="state-icon state-icon--bounce">👈</span>
            <p className="state-text">Vui lòng chọn một thành phố để xem thời tiết</p>
          </div>
        )}

        {selectedCity && loading && (
          <div className="state-placeholder">
            <div className="loading-spinner" />
            <p className="state-text">Đang tải dữ liệu thời tiết...</p>
          </div>
        )}

        {selectedCity && error && (
          <div className="state-placeholder">
            <span className="state-icon">⚠️</span>
            <p className="state-text">Đã có lỗi xảy ra: {error}</p>
            <button type="button" className="action-btn" onClick={handleRetry}>
              🔄 Thử lại
            </button>
          </div>
        )}

        {selectedCity && !loading && !error && weatherData && (
          <div className="weather-content">
            <div className="weather-card">
              <div className="weather-card__header">
                <div>
                  <h2 className="weather-city">{selectedCity.name}</h2>
                  <p className="weather-time">
                    Cập nhật lúc: {formatUpdateTime(weatherData.current.time)}
                  </p>
                </div>
                <Link
                  to={`/city/${encodeURIComponent(selectedCity.name)}`}
                  className="detail-link"
                >
                  Chi tiết ➔
                </Link>
              </div>

              <div className="weather-main">
                <span className="weather-emoji">
                  {getWeatherInfo(weatherData.current.weather_code).icon}
                </span>
                <div className="weather-temp">
                  {formatTemp(weatherData.current.temperature_2m, unit)}
                </div>
              </div>

              <p className="weather-desc">
                {getWeatherInfo(weatherData.current.weather_code).description}
              </p>

              <div className="weather-stats">
                <div className="stat-item">
                  <span className="stat-icon">💧</span>
                  <span className="stat-label">Độ ẩm</span>
                  <span className="stat-value">
                    {weatherData.current.relative_humidity_2m}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">💨</span>
                  <span className="stat-label">Tốc độ gió</span>
                  <span className="stat-value">
                    {weatherData.current.wind_speed_10m} km/h
                  </span>
                </div>
              </div>
            </div>

            <div className="forecast-card">
              <h3 className="forecast-heading">📅 Dự báo thời tiết 7 ngày tới</h3>
              <div className="forecast-grid">
                {weatherData.daily.time.map((dateStr, idx) => {
                  const dayName = getDayOfWeek(dateStr);
                  const shortDate = formatDate(dateStr);
                  const info = getWeatherInfo(weatherData.daily.weather_code[idx]);
                  const maxT = weatherData.daily.temperature_2m_max[idx];
                  const minT = weatherData.daily.temperature_2m_min[idx];

                  return (
                    <div key={dateStr} className="forecast-row">
                      <div className="forecast-date">
                        <span className="forecast-day-name">{dayName}</span>
                        <span className="forecast-day-num">{shortDate}</span>
                      </div>
                      <div className="forecast-status">
                        <span className="forecast-icon">{info.icon}</span>
                        <span className="forecast-desc">{info.description}</span>
                      </div>
                      <div className="forecast-temps">
                        <span className="temp-max">↑ {formatTemp(maxT, unit)}</span>
                        <span className="temp-min">↓ {formatTemp(minT, unit)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
