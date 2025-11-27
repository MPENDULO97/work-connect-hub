import express from 'express';
import * as directionsController from '../controllers/directionsController.js';

const router = express.Router();

router.get('/', directionsController.getDirections);
router.get('/matrix', directionsController.getMatrix);

export default router;
