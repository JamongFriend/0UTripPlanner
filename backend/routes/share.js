//여행 계획 공유 기능

const express = require('express');
const router = express.Router();
const AllPlan = require('../models/allPlan');
const Plan = require('../models/plan');
const { isLoggedIn } = require('./helpers');

// 여행 계획 공유 [POST]
router.post('/upload', isLoggedIn, async(req, res, next) => {
    try {
        const planData = await Plan.findOne({
            where: { 
                planName: req.body.name,
                userId: req.user.id
            }
        });
        
        if (!planData) {
            return res.status(404).json({ message: "공유할 계획을 찾을 수 없습니다." });
        }
        
        await AllPlan.create({
            id: `shared_${Date.now()}`,
            planName: planData.planName,
            startDate: planData.startDate,
            endDate: planData.endDate,
            personnel: planData.personnel,
            purpose: planData.purpose,
            place: planData.place,
            hotel: planData.hotel,
            restaurant: planData.restaurant
        });
        
        res.json({ success: true, message: '공유 성공' });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 모든 유저의 공유된 여행 리스트 보기 [GET]
router.get('/view/:id', async (req, res, next) => {
    try {
        const userPlan = await AllPlan.findOne({
            where: { id: req.params.id },
            attributes: [
                'id', 
                ['planName', 'name'],
                ['startDate', 'date'], 
                ['personnel', 'peoples'], 
                ['purpose', 'perpose'], 
                'place', 
                'hotel',
                'restaurant'
            ]
        });

        if (userPlan) {
            res.json(userPlan);
        } else {
            res.status(404).json({ message: "해당 계획을 찾을 수 없습니다." });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 공유된 계획 가져오기
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
router.post('/getplan/:id', isLoggedIn, async(req, res, next) => {
    try {
        const sharedData = await AllPlan.findOne({
            where: { id: req.params.id }
        });

        if (!sharedData) {
            return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
        }
        
        await Plan.create({
            id: `plan_${Date.now()}`, 
            planName: sharedData.planName,
            startDate: sharedData.startDate,
            endDate: sharedData.endDate,
            personnel: sharedData.personnel,
            purpose: sharedData.purpose,
            place: sharedData.place,
            hotel: sharedData.hotel,
            restaurant: sharedData.restaurant,
            userId: req.user.id // 내 계정으로 귀속
        });

        res.json({ success: true, message: '가져오기 성공' });
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;