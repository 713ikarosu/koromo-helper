// OpenWeatherAPIを使用した天気サービス

// 天気データの型定義
export interface WeatherData {
  temperature: number;
  weather: string;
  location: string;
  timestamp: string;
  humidity?: number;
  windSpeed?: number;
  isDefault?: boolean;
}

// OpenWeatherMap APIレスポンスの型定義
interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind?: {
    speed: number;
  };
  name: string;
}

// Geolocation API Position の型定義
interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export class WeatherService {
  private static readonly API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  private static readonly API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  // 天気の日本語マッピング
  private static readonly weatherMap: Record<string, string> = {
    "clear sky": "晴れ",
    "few clouds": "晴れ時々曇り",
    "scattered clouds": "曇り",
    "broken clouds": "曇り",
    "overcast clouds": "曇り",
    "shower rain": "にわか雨",
    rain: "雨",
    thunderstorm: "雷雨",
    snow: "雪",
    mist: "霧",
    fog: "霧",
    haze: "もやっている",
  };

  static async getCurrentWeather(): Promise<WeatherData> {
    try {
      // 位置情報の取得を試みる
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            { timeout: 10000, maximumAge: 300000 } // 5分間キャッシュ
          );
        } else {
          reject(new Error("Geolocation not supported"));
        }
      });

      const { latitude, longitude } = position.coords;

      // OpenWeatherAPI呼び出し
      const response = await fetch(
        `${this.API_BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric&lang=ja`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: OpenWeatherResponse = await response.json();
      return this.parseWeatherData(data);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log("天気情報取得失敗、ユーザー入力が必要:", errorMessage);
      
      // エラーを投げてホーム画面でユーザー入力フォームを表示させる
      throw new Error("位置情報が取得できませんでした。手動で天気情報を入力してください。");
    }
  }

  private static parseWeatherData(data: OpenWeatherResponse): WeatherData {
    const weatherDescription = data.weather[0].description;
    const weather =
      this.weatherMap[data.weather[0].main.toLowerCase()] ||
      (weatherDescription.includes("晴")
        ? "晴れ"
        : weatherDescription.includes("雲") ||
            weatherDescription.includes("曇")
          ? "曇り"
          : weatherDescription.includes("雨")
            ? "雨"
            : "晴れ");

    return {
      temperature: Math.round(data.main.temp),
      weather,
      location: data.name || "現在地",
      timestamp: new Date().toISOString(),
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed || 0,
    };
  }
}