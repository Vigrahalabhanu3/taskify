import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('weather')
@UseGuards(JwtAuthGuard)
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  async getWeather(@Query('location') location: string) {
    const data = await this.weatherService.getWeatherForLocation(location);
    return {
      success: true,
      data,
    };
  }
}
