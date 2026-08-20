import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { ConfigService } from '@nestjs/config';

describe('WeatherService Unit Tests', () => {
  let weatherService: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock_key'),
          },
        },
      ],
    }).compile();

    weatherService = module.get<WeatherService>(WeatherService);
  });

  it('should return fallback weather when location is provided but API key is mock', async () => {
    const data = await weatherService.getWeatherForLocation('Hyderabad');
    expect(data).toBeDefined();
    expect(data.location).toContain('Hyderabad');
    expect(data.temp).toBeGreaterThanOrEqual(0);
    expect(data.condition).toBe('Clear Sky');
  });

  it('should return fallback weather for unknown/empty location', async () => {
    const data = await weatherService.getWeatherForLocation('');
    expect(data).toBeDefined();
    expect(data.location).toBe('Unknown Location');
  });
});
