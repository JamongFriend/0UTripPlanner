//여행 계획 공유 기능

const express = require('express');
const router = express.Router();
const { Plan, User, DayPlace } = require('../models');
const { isLoggedIn } = require('./helpers');

// 여행 계획 공유 [POST]
router.post('/share', isLoggedIn, async(req, res, next) => {
    try {
        const result = await Plan.update(
            { isShared: 1 },
            { 
                where: { 
                    id: req.body.id,
                    userId: req.user.id
                } 
            }
        );
        if (result[0] > 0) {
            res.json({ success: true, message: '성공적으로 공유되었습니다.' });
        } else {
            res.status(404).json({ message: "공유할 계획을 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 공유된 여행 계획 리스트 전체 보기 [GET]
router.get('/readList', async (req, res, next) => {
    try {
        const plans = await Plan.findAll({
            where: { isShared: 1 },
            include: [
                { model: User, attributes: ['name'] },
                {
                    model: DayPlace,
                    as: 'dayPlaces',
                    attributes: ['id', 'day', 'time', 'title', 'category', 'placeName'],
                    required: false
                }
            ],
            order: [
                ['createdAt', 'DESC'],
                [{ model: DayPlace, as: 'dayPlaces' }, 'day', 'ASC'],
                [{ model: DayPlace, as: 'dayPlaces' }, 'time', 'ASC']
            ]
        });

        const formattedPlans = plans.map(p => ({
            id: p.id,
            title: p.planName,
            writer: p.User ? p.User.name : '익명',
            likes: p.likes,
            place: p.place,
            startDate: p.startDate,
            endDate: p.endDate,
            purpose: p.purpose,
            description: p.description,
            userId: p.userId,
            dayPlaces: p.dayPlaces || []
        }));

        res.json(formattedPlans);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 공유된 계획 상세 보기 [GET]
router.get('/view/:id', async (req, res, next) => {
    try {
        const plan = await Plan.findOne({
            where: { id: req.params.id, isShared: 1 },
            attributes: [
                'id', 
                ['planName', 'name'],
                'startDate', 
                'endDate',
                ['personnel', 'peoples'], 
                ['purpose', 'perpose'],
                'place',
                'userId',
                'likes'
            ]
        });

        if (plan) {
            res.json(plan);
        } else {
            res.status(404).json({ message: "해당 계획을 찾을 수 없습니다." });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 공유된 계획 내 보관함으로 가져오기 [POST/GET]
router.post('/getPlan/:id', isLoggedIn, async (req, res, next) => {
    try {
        const sharedData = await Plan.findOne({
            where: { id: req.params.id, isShared: 1 }
        });

        if (!sharedData) {
            return res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
        }

        const originalInfo = `\n\n[원작자: ${sharedData.userId || '익명'}]`;
        
        await Plan.create({
            id: `plan_${Date.now()}`, 
            planName: sharedData.planName + " (복사본)",
            startDate: sharedData.startDate,
            endDate: sharedData.endDate,
            personnel: sharedData.personnel,
            purpose: sharedData.purpose,
            place: sharedData.place,
            description: (sharedData.description || "") + originalInfo,
            userId: req.user.id, 
            isShared: 0,
            likes: 0
        });
        res.json({ success: true, message: '내 플래너로 가져왔습니다. 이제 자유롭게 수정해보세요!' });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 좋아요 기능 [POST]
router.post('/like/:id', isLoggedIn, async (req, res, next) => {
    try {
        await Plan.increment('likes', { 
            by: 1, 
            where: { id: req.params.id, isShared: 1 } 
        });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        next(err);
    }
})

module.exports = router;