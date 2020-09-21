import {HttpService} from './http.service';
import {config} from '../config';

export class WeatherService {

  constructor(private readonly http: HttpService) {
  }

  getCurrentWeather(city: string, lang: string = 'uk'): Promise<object> {
    return this.http.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.openWeatherApiKey}&lang=${lang}&units=metric`);
  }

  getHourlyWeather(city: string, lang: string = 'uk'): Promise<object> {
    return this.http.get(`http://api.openweathermap.org/data/2.5/onecall?q=${city}&appid=${config.openWeatherApiKey}&lang=${lang}&units=metric`);
  }
}
