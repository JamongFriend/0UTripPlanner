//// 여행지, 숙박시설, 식당 추천 통합 (지도 정보 포함)

const express = require('express');
const Suggest = require('../models/suggest');

const router = express.Router();

router.get('/suggest', async (req, res, next) => {
    try {
        const allSuggestions = await Suggest.findAll();

        const response = {
            places: allSuggestions
                .filter(item => item.place)
                .map(item => ({
                    name: item.place,
                    latitude: item.latitude,
                    longitude: item.longitude
                })),
            hotels: allSuggestions
                .filter(item => item.hotel)
                .map(item => ({
                    name: item.hotel,
                    latitude: item.latitude,
                    longitude: item.longitude
                })),
            restaurants: allSuggestions
                .filter(item => item.restaurant)
                .map(item => ({
                    name: item.restaurant,
                    latitude: item.latitude,
                    longitude: item.longitude
                }))
        };

        res.json(response);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
