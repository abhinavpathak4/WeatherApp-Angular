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

  forecastList: ForecastData[] = [];// list to store weather forecast data
  cityName: string = 'delhi'; 
  errorFlag: boolean = false;// flag to check whether the searched city data exists or not

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
    cityName.trim();
    this.weatherService.getWeatherData(cityName).pipe(
      map((response: WeatherResponse) => {
        const forecastList: { [date: string]: ForecastData } = {};
        response.list.forEach(forecast => {
          const formattedDate = this.formatDate(forecast.dt * 1000);
          if (!forecastList[formattedDate]) {
            forecastList[formattedDate] = {
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
            forecastList[formattedDate].minTemp = Math.min(forecastList[formattedDate].minTemp, forecast.main.temp_min);
            forecastList[formattedDate].maxTemp = Math.max(forecastList[formattedDate].maxTemp, forecast.main.temp_max);
          }
        });    
        this.forecastList = Object.values(forecastList);
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
}

