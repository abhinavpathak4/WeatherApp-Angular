import { Component, OnInit } from '@angular/core';
import {  map } from 'rxjs/operators';
import { ForecastData } from 'src/app/interfaces/forecast-data';
import { WeatherResponse } from 'src/app/interfaces/weather-response';
import { WeatherService } from 'src/app/services/weather.service';



@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  // list to store weather forecast data
  forecastData: ForecastData[] = [];

  // name of city
  cityName: string = 'delhi';

  // flag to check whether the searched city data exists or not
  errorFlag: boolean = false;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeather(this.cityName);
  }

  /**
   * @method getWeather
   * get weather of city searched
   * @param cityName name of city to search for it's weather data
   * @memberof WeatherComponent
   */
  getWeather(cityName: string): void {
    this.weatherService.getWeatherData(cityName).pipe(
      map((response: WeatherResponse) => {
        const forecastData: { [date: string]: ForecastData } = {};
        response.list.forEach(forecast => {
          const formattedDate = this.formatDate(forecast.dt * 1000);
          if (!forecastData[formattedDate]) {
            forecastData[formattedDate] = {
              date: formattedDate,
              temp: forecast.main.temp,
              humidity: forecast.main.humidity,
              windSpeed: forecast.wind.speed,
              weather: forecast.weather[0].main,
              minTemp: forecast.main.temp_min,
              maxTemp: forecast.main.temp_max,
              feelsLike: forecast.main.feels_like
            };
          } else {
            forecastData[formattedDate].minTemp = Math.min(forecastData[formattedDate].minTemp, forecast.main.temp_min);
            forecastData[formattedDate].maxTemp = Math.max(forecastData[formattedDate].maxTemp, forecast.main.temp_max);
          }
        });
        
        this.forecastData = Object.values(forecastData);
        return response;
      })
    ).subscribe(
      (response: WeatherResponse) => {
        this.errorFlag = false;
        this.cityName = cityName;
      },
      (error: Error) => {
        this.errorFlag = true;
      }
    );
  }



  /**
   * @method formatDate
   * Transform timestamp to formatted date string
   * @param timestamp
   * @returns formatted date string
   * @memberof WeatherComponent
   */
  formatDate(timestamp: number): string {
    const dateObj = new Date(timestamp);
    const month = dateObj.toLocaleString('en-US', { month: 'long' });
    const day = dateObj.toLocaleString('en-US', { day: 'numeric' });
    const weekday = dateObj.toLocaleString('en-US', { weekday: 'long' });
    return `${month} ${day}, ${weekday}`;
  }

  /**
   * @method getWeatherBackground
   * get url of image to be displayed as card's background
   * @param temperature 
   * @param weather 
   * @returns image url to be displayed as background
   * @memberof WeatherComponent
   */
  getWeatherBackground(temperature: number, weather : string): string {
    if (temperature <= 0) return 'url(/assets/snowfall.jpg)';
    else if (weather === 'Rain') return 'url(/assets/bg-rain.png)';
    else if (weather === 'Clear') return 'url(/assets/bg-clear.png)';
    else if (weather === 'Clouds') return 'url(/assets/bg-cloudy.png)';
    else return 'url(/assets/snowfall.jpg)';
  }

   /**
   * @method getWeatherIcon
   * get url of icon to be displayed
   * @param temperature 
   * @param weather 
   * @returns icon url(as string) to be displayed as background
   * @memberof WeatherComponent
   */
  getWeatherIcon(weather: string, temperature: number): string {
    if (temperature <= 0) return '/assets/icon-snow.png';
    else if (weather === 'Rain') return '/assets/icon-rain.png';
    else if (weather === 'Clouds') return '/assets/icon-clouds.png';
    else if (weather === 'Clear') return '/assets/icon-clear.png';
    else return '/assets/icon-clouds.png';
  }
}

