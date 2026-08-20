export interface WeatherData {
  location: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  updatedAt: string;
}

export interface WeatherResponse {
  success: boolean;
  data: WeatherData;
}
