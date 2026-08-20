import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { WeatherData } from '@/types/weather.types';

export function useWeatherQuery(location?: string) {
  return useQuery<WeatherData>({
    queryKey: ['weather', location],
    queryFn: async () => {
      const { data } = await apiClient.get('/weather', { params: { location } });
      return data.data;
    },
    enabled: !!location && location.trim().length > 0,
    staleTime: 1000 * 60 * 15, // Cache for 15 mins
  });
}
