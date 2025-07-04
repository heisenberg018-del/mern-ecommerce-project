import express from 'express';
const router = express.Router();

import { adminRoute, protectRoute } from '../middlewares/auth.middleware.js';
import { getAnalyticsData, getDailySalesData } from '../controllers/analytics.controller.js';


router.get("/", protectRoute, adminRoute, async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailySalesData = await getDailySalesData(startDate, endDate);

        res.json({
            analyticsData,
            dailySalesData,
        })
    } catch (error) {
        console.log("Error in analytics route", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})


export default router;