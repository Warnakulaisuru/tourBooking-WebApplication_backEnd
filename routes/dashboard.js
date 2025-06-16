import express from 'express';
import { getDashboardStats, getMonthlyBookings, getMostPopularTour, getTourBookings } from '../controllers/dashboardController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/stats', verifyAdmin, getDashboardStats);
router.get("/bookings-trend", getMonthlyBookings);
router.get("/popular-tour", getMostPopularTour);
router.get("/tour-bookings", getTourBookings);

export default router;