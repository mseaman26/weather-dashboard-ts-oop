import { Router, type Request, type Response } from 'express';
const router = Router();



import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {

  // TODO: GET weather data from city name
  try{
    const city = req.body.cityName
    const data = await WeatherService.getWeatherForCity(city)
    await HistoryService.addCity(city)
    res.json(data)
  }catch(err){
    console.log(err)
  }

  // TODO: save city to search history
 
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try{
    const history = await HistoryService.getCities()
    console.log('history: ', history)
    res.json(history)
  }catch(err){
    console.log(err)
  }

  
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try{
    await HistoryService.removeCity(req.params.id)
    const updatedCities = await HistoryService.getCities()
    res.json(updatedCities)
  }catch(err){
    console.log('error in remove city route: ', err)
  }
});

export default router;
