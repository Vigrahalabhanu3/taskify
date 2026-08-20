'use client';

import { useWeatherQuery } from '@/hooks/use-weather';
import { Sun, Cloud, CloudRain, Wind, Droplets, Thermometer, MapPin } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface WeatherWidgetProps {
  location?: string;
  compact?: boolean;
}

export function WeatherWidget({ location, compact = false }: WeatherWidgetProps) {
  const { data: weather, isLoading, isError } = useWeatherQuery(location);

  if (!location || !location.trim()) {
    return compact ? (
      <span className="text-xs text-slate-400 italic">No location set</span>
    ) : (
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-xs text-slate-500">
        Add a location to view live weather forecast.
      </div>
    );
  }

  if (isLoading) {
    return compact ? (
      <Skeleton className="h-5 w-16" />
    ) : (
      <Skeleton className="h-32 w-full rounded-2xl" />
    );
  }

  if (isError || !weather) {
    return compact ? (
      <span className="text-xs text-slate-400">Weather N/A</span>
    ) : (
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-slate-400" />
        <span>Weather data unavailable for &quot;{location}&quot;</span>
      </div>
    );
  }

  const getWeatherIcon = (cond: string) => {
    const lower = cond.toLowerCase();
    if (lower.includes('rain')) return <CloudRain className="w-7 h-7 text-sky-500 animate-bounce" />;
    if (lower.includes('cloud')) return <Cloud className="w-7 h-7 text-indigo-400" />;
    return <Sun className="w-7 h-7 text-amber-500" />;
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-amber-50/80 border border-amber-200/60 px-2.5 py-1 rounded-lg">
        {getWeatherIcon(weather.condition)}
        <span className="font-semibold">{weather.temp}°C</span>
        <span className="text-slate-500 capitalize hidden sm:inline">{weather.condition}</span>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-indigo-50/30 border border-amber-200/60 shadow-xs relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span>Live Weather &bull; {weather.location}</span>
        </div>
        <span className="text-[10px] text-slate-400">Updated recently</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-100/60 rounded-2xl">{getWeatherIcon(weather.condition)}</div>
          <div>
            <div className="text-3xl font-extrabold text-slate-800 tracking-tight">{weather.temp}°C</div>
            <div className="text-sm font-medium text-slate-600 capitalize">{weather.condition}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs border-l border-slate-200/60 pl-6">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>Humidity: <strong className="text-slate-800">{weather.humidity}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Wind className="w-3.5 h-3.5 text-indigo-500" />
            <span>Wind: <strong className="text-slate-800">{weather.windSpeed} km/h</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 col-span-2">
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            <span>Feels like: <strong className="text-slate-800">{weather.feelsLike}°C</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
