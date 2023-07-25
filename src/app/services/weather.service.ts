import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WeatherResponse } from '../interfaces/weather-response';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey: string = environment.apiKey;
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}
  getWeatherData(city: string) {
    const url = `${this.baseUrl}?q=${city}&units=metric&APPID=${this.apiKey}`;
    return this.http.get<WeatherResponse>(url); 
  }
}
