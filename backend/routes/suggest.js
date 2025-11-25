//// 여행지, 숙박시설, 식당 추천 통합 (지도 정보 포함)

const express = require('express');
const Suggest = require('../models/suggest');

const router = express.Router();

router.get('/suggest', async (req, res, next) => {
    try {
        const places = await Suggest.findAll({ attributes: ['place', 'latitude', 'longitude'] });
        const hotels = await Suggest.findAll({ attributes: ['hotel', 'latitude', 'longitude'] });
        const restaurants = await Suggest.findAll({ attributes: ['restaurant', 'latitude', 'longitude'] });

        res.json({
            places: places.map(item => ({
                name: item.place,
                latitude: item.latitude,
                longitude: item.longitude
            })),
            hotels: hotels.map(item => ({
                name: item.hotel,
                latitude: item.latitude,
                longitude: item.longitude
            })),
            restaurants: restaurants.map(item => ({
                name: item.restaurant,
                latitude: item.latitude,
                longitude: item.longitude
            }))
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
