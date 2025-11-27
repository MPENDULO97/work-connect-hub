import express from 'express';
import * as weatherController from '../controllers/weatherController.js';

const router = express.Router();

router.get('/', weatherController.getWeather);
router.get('/forecast', weatherController.getForecast);

export default router;
