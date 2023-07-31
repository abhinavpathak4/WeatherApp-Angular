import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeatherResponse } from '../interfaces/weather-response';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) {}

  /**
   * @method getWeatherData
   * makes api call to open weather api
   * @param city city name for which weather data is required
   * @returns observable of WeatherResponse type
   * @memberof weatherService
   */
  getWeatherData(city: string): Observable<WeatherResponse> {
    const url = `${environment.baseUrl}?q=${city}&units=metric&APPID=${environment.apiKey}`;
    return this.http.get<WeatherResponse>(url); 
  }
}
