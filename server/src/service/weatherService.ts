import dotenv from 'dotenv';
dotenv.config();

function convertDate(str: string){
  const date = new Date(str)
  const formattedDate = `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()}`;
  return formattedDate
}
const convertToFahrenheit = (k:number): number => {
  return parseFloat(((k - 273.15) * (9/5) + 32).toFixed(2))
}

// TODO: Define an interface for the Coordinates object
interface Coordinates{
  lat: number
  lon: number
}

// TODO: Define a class for the Weather object
//{ city, date, icon, iconDescription, tempF, windSpeed, humidity }
class Weather{
  city: string
  date: string
  icon: string
  iconDescription: string
  tempF: number
  windSpeed: number
  humidity: number
  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number){
    this.city = city
    this.date = date
    this.icon = icon
    this.iconDescription = iconDescription
    this.tempF = tempF
    this.windSpeed = windSpeed
    this.humidity = humidity
  }

}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string
  private APIKey: string
  private cityName: string
  constructor(){
    this.cityName = ''
    this.baseURL = process.env.API_BASE_URL as string
    this.APIKey = process.env.API_KEY as string
  }
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(query: string){

    try{
      if(!this.APIKey || !this.baseURL){
        throw new Error('api key and base url need to be provided within the WeatherService class')
      }
      const response = await fetch(query)
      const data = await response.json()
      return data[0]
    }catch(err){
      console.log(err)
    }
  }
  // TODO: Create destructureLocationData method
  
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: Coordinates): Coordinates{
    if(!locationData){
      throw new Error('city not found')
    }
    const {lat, lon} = locationData
    const coordinates: Coordinates = {
      lat,
      lon
    }
    return coordinates
   }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(): string{
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.APIKey}`
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.APIKey}`
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery())
    const destructuredData = this.destructureLocationData(locationData)
    return destructuredData
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherData = await fetch(this.buildWeatherQuery(coordinates))
    const parsedWeatherData = await weatherData.json()
    return parsedWeatherData
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    if(!response){
      throw new Error('no adequate weather data to parse')
    }

    // let counter = 0
    // for(let i  = 0; i< response.list.length; i++){
    //   if(response.list[i].dt_txt.includes('12:00')){
    //     counter++
    //     console.log('index is: ', i)
    //     console.log('counter: ', counter)
    //   }
    // }
    const currentWeather = response.list[0]
    // const dateStr = currentWeather.dt_txt
    // const date = new Date(dateStr)
    // const formattedDate = `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()}`;
    const formattedDate = convertDate(currentWeather.dt_txt)

    const parsedCurrentWeather: Weather = new Weather(response.city.name, formattedDate, currentWeather.weather[0].icon, currentWeather.weather[0].description, convertToFahrenheit(currentWeather.main.temp), currentWeather.wind.speed, currentWeather.main.humidity )
    return parsedCurrentWeather
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const weatherArray = [currentWeather]
    for(let i = 1; i < weatherData.length; i++){
      if(weatherData[i].dt_txt.includes('12:00:00')){
        console.log('pushing to array')
        const weatherObj = new Weather(
          this.cityName,
          convertDate(weatherData[i].dt_txt),
          weatherData[i].weather[0].icon,
          weatherData[i].weather[0].description,
          convertToFahrenheit(weatherData[i].main.temp),
          weatherData[i].wind.speed,
          weatherData[i].main.humidity
        )
        weatherArray.push(weatherObj)
      }
    }
    return weatherArray
  }
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string){
    this.cityName = city
    const coordinates = await this.fetchAndDestructureLocationData()
    const weatherData = await this.fetchWeatherData(coordinates)
    const forcastArray = this.buildForecastArray(this.parseCurrentWeather(weatherData), weatherData.list)
    return forcastArray
    // return [this.parseCurrentWeather(weatherData)]
  }
}

export default new WeatherService();
