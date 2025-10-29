//여행 계획 공유 기능

const express = require('express');
const router = express.Router();
const AllPlan = require('../models/allPlan');
const Plan = require('../models/plan');

const { isLoggedIn } = require('./helpers');

// 여행 계획 공유 [POST]
router.post('/upload', async(req, res, next) => {
    try {
        const planData = await Plan.findOne({
            where: {
                name: req.body.name
            }
        });
        
        if (!planData) {
            return next(`There is no plan with ${req.body.name}.`);
        }
        
        await AllPlan.create({
            id: planData.id,
            name: planData.name,
            date: planData.date,
            peoples: planData.peoples,
            perpose: planData.perpose,
            place: planData.place,
            hotel: planData.hotel,
            restaurant: planData.restaurant
        });
        
        res.redirect('/');
        
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 모든 유저의 공유된 여행 리스트 보기 [GET]
router.get('/sharedlist', async(req, res, next) => {
    try {
        const allUserPlan = await AllPlan.findAll({
            attributes: ['id', 'name', 'place']
        });
        res.json(allUserPlan);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 확인하고픈 계획 보기 [GET]
router.get('/view/:id', async (req, res, next) => {
    try {
        const userPlan = await AllPlan.findOne({
            where: { 
                id: req.params.id,
                name: req.params.name
            },
            attributes: ['id', 'name', 'date', 'peoples', 'perpose', 'place', 'hotel']
        });
        if (userPlan) {
            res.json(userPlan);
        } else {
            next(`There is no plan with ${req.params.id}.`);
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});


// 계획 가져오기 [POST]
router.post('/getplan/:id/:name', async(req, res, next) => {
    try {
        const planData = await AllPlan.findOne({
            where: {
                id: req.params.id,
                name: req.params.name
            }
        });
        if (!planData) {
            return next(`There is no plan with ${req.params.name}.`);
        }
        
        await Plan.create({
            id: planData.id,
            name: planData.name,
            date: planData.date,
            peoples: planData.peoples,
            perpose: planData.perpose,
            place: planData.place,
            hotel: planData.hotel
        });

        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;