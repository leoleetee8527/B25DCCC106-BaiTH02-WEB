import type { City, WeatherResponse } from '../types';

export const CITIES: City[] = [
  { name: 'Hà Nội', lat: 21.0285, lon: 105.8542 },
  { name: 'Hải Phòng', lat: 20.8449, lon: 106.6881 },
  { name: 'Huế', lat: 16.4637, lon: 107.5909 },
  { name: 'Đà Nẵng', lat: 16.0544, lon: 108.2022 },
  { name: 'Nha Trang', lat: 12.2388, lon: 109.1967 },
  { name: 'Đà Lạt', lat: 11.9404, lon: 108.4583 },
  { name: 'TP. Hồ Chí Minh', lat: 10.8231, lon: 106.6297 },
  { name: 'Cần Thơ', lat: 10.0452, lon: 105.7469 },
];

export async function fetchWeather(city: City): Promise<WeatherResponse> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=Asia%2FHo_Chi_Minh&forecast_days=7`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Lỗi HTTP: ${response.status}`);
  }

  return response.json();
}

const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Trời quang', icon: '☀️' },
  1: { description: 'Gần như quang', icon: '🌤️' },
  2: { description: 'Có mây rải rác', icon: '⛅' },
  3: { description: 'Nhiều mây', icon: '☁️' },
  45: { description: 'Sương mù', icon: '🌫️' },
  48: { description: 'Sương mù đóng băng', icon: '🌫️' },
  51: { description: 'Mưa phùn nhẹ', icon: '🌦️' },
  53: { description: 'Mưa phùn vừa', icon: '🌦️' },
  55: { description: 'Mưa phùn dày', icon: '🌦️' },
  56: { description: 'Mưa phùn đóng băng nhẹ', icon: '🌧️' },
  57: { description: 'Mưa phùn đóng băng dày', icon: '🌧️' },
  61: { description: 'Mưa nhẹ', icon: '🌧️' },
  63: { description: 'Mưa vừa', icon: '🌧️' },
  65: { description: 'Mưa to', icon: '🌧️' },
  66: { description: 'Mưa đóng băng nhẹ', icon: '🌧️' },
  67: { description: 'Mưa đóng băng nặng', icon: '🌧️' },
  71: { description: 'Tuyết nhẹ', icon: '🌨️' },
  73: { description: 'Tuyết vừa', icon: '🌨️' },
  75: { description: 'Tuyết dày', icon: '❄️' },
  77: { description: 'Hạt tuyết', icon: '❄️' },
  80: { description: 'Mưa rào nhẹ', icon: '🌦️' },
  81: { description: 'Mưa rào vừa', icon: '🌧️' },
  82: { description: 'Mưa rào to', icon: '🌧️' },
  85: { description: 'Tuyết rào nhẹ', icon: '🌨️' },
  86: { description: 'Tuyết rào nặng', icon: '🌨️' },
  95: { description: 'Dông', icon: '⛈️' },
  96: { description: 'Dông kèm mưa đá nhẹ', icon: '⛈️' },
  99: { description: 'Dông kèm mưa đá nặng', icon: '⛈️' },
};

export function getWeatherInfo(code: number) {
  return WEATHER_CODES[code] || { description: 'Không xác định', icon: '❓' };
}

export function getWeatherBackground(code: number): string {
  if (code === 0 || code === 1) return 'linear-gradient(135deg, #2980b9, #6dd5fa, #ffffff)';
  if (code === 2 || code === 3) return 'linear-gradient(135deg, #4b6cb7, #182848)';
  if (code >= 45 && code <= 48) return 'linear-gradient(135deg, #606c88, #3f4c6b)';
  if (code >= 51 && code <= 67) return 'linear-gradient(135deg, #3a7bd5, #3a6073)';
  if (code >= 71 && code <= 77) return 'linear-gradient(135deg, #83a4d4, #b6fbff)';
  if (code >= 80 && code <= 82) return 'linear-gradient(135deg, #2c3e50, #3498db)';
  if (code >= 85 && code <= 86) return 'linear-gradient(135deg, #606c88, #3f4c6b)';
  if (code >= 95) return 'linear-gradient(135deg, #1f1c2c, #928dab)';
  return 'linear-gradient(135deg, #2980b9, #6dd5fa, #ffffff)';
}

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function formatTemp(tempC: number, unit: 'C' | 'F'): string {
  if (unit === 'F') return `${celsiusToFahrenheit(tempC).toFixed(1)}°F`;
  return `${tempC.toFixed(1)}°C`;
}

export function getDayOfWeek(dateStr: string): string {
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const date = new Date(dateStr + 'T00:00:00');
  return days[date.getDay()];
}

export function formatDate(dateStr: string): string {
  const parts = dateStr.split('-');
  return `${parts[2]}/${parts[1]}`;
}

export function formatUpdateTime(timeStr: string): string {
  const date = new Date(timeStr);
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const mo = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${h}:${m} - ${d}/${mo}/${date.getFullYear()}`;
}

export function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[.]/g, '');
}
