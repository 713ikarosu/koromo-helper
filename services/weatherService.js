// OpenWeatherAPIを使用した天気サービス
export class WeatherService {
  static API_KEY = "9a1667cfbfa87288ca87ed39e9141069";
  static API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

  static async getCurrentWeather() {
    try {
      // 位置情報の取得を試みる
      const position = await new Promise((resolve, reject) => {
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

      const data = await response.json();

      // 天気情報の日本語対応
      const weatherMap = {
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

      const weatherDescription = data.weather[0].description;
      const weather =
        weatherMap[data.weather[0].main.toLowerCase()] ||
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
    } catch (error) {
      console.log("天気情報取得失敗、デフォルト値を使用:", error.message);

      // フォールバック: デフォルトの天気情報（東京の座標でAPI呼び出しを試行）
      try {
        const response = await fetch(
          `${this.API_BASE_URL}?lat=35.6895&lon=139.692&appid=${this.API_KEY}&units=metric&lang=ja`
        );

        if (response.ok) {
          const data = await response.json();

          const weatherMap = {
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

          const weatherDescription = data.weather[0].description;
          const weather =
            weatherMap[data.weather[0].main.toLowerCase()] ||
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
            location: "東京",
            timestamp: new Date().toISOString(),
            humidity: data.main.humidity,
            windSpeed: data.wind?.speed || 0,
            isDefault: true,
          };
        }
      } catch (apiError) {
        console.error("API fallback also failed:", apiError);
      }

      // 最終的なフォールバック: 固定値
      return {
        temperature: 20,
        weather: "晴れ",
        location: "東京",
        timestamp: new Date().toISOString(),
        isDefault: true,
      };
    }
  }
}
