export interface WeatherResponse {
    city: {
        name: string;
        country : string;
        sunrise : number;
        sunset : number;
      };
      list: {
        dt: number;
        main: {
          temp_max: number;
          feels_like: number;
          temp_min: number;
          humidity: number;
          temp : number;
        };
        weather :[
          {
            main: string; // Clear, Cloudy, Rain , Clouds
          }
        ] 
        wind: {
          speed: number;
          deg : number;
        };
      }[];
    }
