export interface City {
  name: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  weather_code: number;
  wind_speed_10m: number;
  time: string;
}

export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface WeatherResponse {
  current: CurrentWeather;
  daily: DailyWeather;
}

export interface WeatherInfo {
  description: string;
  icon: string;
}

export type TemperatureUnit = 'C' | 'F';

export interface LayoutContextType {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  background: string;
  setBackground: (bg: string) => void;
}

export interface LayoutContextType {
  unit: TemperatureUnit;
  setUnit: (unit: TemperatureUnit) => void;
  background: string;
  setBackground: (bg: string) => void;
}

