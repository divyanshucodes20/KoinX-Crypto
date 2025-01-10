
import express from 'express';
import { getLatestStats, getPriceDeviation } from '../controllers/statsController.js';

const router = express.Router();

router.get('/stats', getLatestStats);

router.get('/deviation', getPriceDeviation);

export default router;
