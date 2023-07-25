import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { WeatherResponse } from 'src/app/interfaces/weather-response';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  forecastData: any[] = []; // Array to store weekly report data
  cityName : string = 'delhi';
  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getWeather("delhi");
  }

  getWeather(cityName: string) {
    this.weatherService.getWeatherData(cityName).pipe(
      map((response: WeatherResponse) => {
        // Extract dates and max temperature from the forecast data
        const forecastData: { [date: string]: any } = {}; // Use an object instead of Map
        response.list.forEach(forecast => {
          const dateObj = new Date(forecast.dt * 1000);
          const month = dateObj.toLocaleString('en-US', { month: 'long' });
          const day = dateObj.toLocaleString('en-US', { day: 'numeric' });
          const weekday = dateObj.toLocaleString('en-US', { weekday: 'long' });
          const formattedDate = `${month} ${day}, ${weekday}`;

          if (!forecastData[formattedDate]) {
            forecastData[formattedDate] = {
              date: formattedDate,
              temp: forecast.main.temp,
              humidity: forecast.main.humidity,
              windSpeed: forecast.wind.speed,
              weather: forecast.weather[0].main,
              minTemp: forecast.main.temp_min,
              maxTemp: forecast.main.temp_max
            };
          } else {
            forecastData[formattedDate].minTemp = Math.min(forecastData[formattedDate].minTemp, forecast.main.temp_min);
            forecastData[formattedDate].maxTemp = Math.max(forecastData[formattedDate].maxTemp, forecast.main.temp_max);
          }
        });

        this.forecastData = Object.values(forecastData);
        console.log(this.forecastData);

        return response;
      })
    ).subscribe(
      (response: WeatherResponse) => {
        // Here you can continue with the rest of your logic using the response data
        // ...
      },
      (error: any) => {
        console.error('Error fetching weather data:', error);
      }
    );
    this.cityName = cityName;
  }


  getWeatherBackground(temperature: number): string {
    if (temperature >= 25) {
      return 'url(/assets/hot.jpg)';
    } else if (temperature < 25 && temperature >= 15) {
      return 'url(/assets/clear.jpg)';
    } else if (temperature < 15) {
      return 'url(/assets/cold.jpg)';
    } else {
      return 'url(/assets/cold.jpg)'; // Fallback image
    }
  }
}
