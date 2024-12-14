// // TODO: Define a City class with name and id properties
import { v4 as uuid } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


class City{
  name: string
  id: string
  constructor(name: string, id?: string){
    this.name = name
    this.id = id ||uuid()
  }

}
// // TODO: Complete the HistoryService class
class HistoryService {
//   // TODO: Define a read method that reads from the searchHistory.json file
private async read (){
  const data = await fs.readFile(path.resolve(__dirname, '../../db/db.json'), 'utf-8')
  return JSON.parse(data)
}
//   // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
private async write(cities: City[]) {
  fs.writeFile(path.resolve(__dirname, '../../db/db.json'), JSON.stringify(cities, null, 2))
}
//   // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
async getCities() {
  const arr: City[] = []
  const data = await this.read()
  for(const item of data){
    const cityObj = new City(
      item.name,
      item.id
    )
    arr.push(cityObj)
  }
  return arr
}
//   // TODO Define an addCity method that adds a city to the searchHistory.json file
async addCity(city: string) {
  const cities = await this.getCities()
  const filteredCities = cities.filter((cityInArray) => cityInArray.name !== city)
  const cityObj = new City(city)
  filteredCities.push(cityObj)
  await this.write(filteredCities)
}
//   // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
async removeCity(id: string) {
  const cities = await this.getCities()
  console.log('id: ', id)
  const fileteredCities = cities.filter((cityInArray) => {
    console.log('city in array: ', cityInArray)
    return cityInArray.id !== id
  })
  console.log('filtered cities: ', fileteredCities)
  this.write(fileteredCities)
}
}

export default new HistoryService();
