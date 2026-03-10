// 북마크 기능

const express = require('express');
const router = express.Router();
const Plan = require('../models/plan');
const User = require('../models/user');
const { isLoggedIn } = require('./helpers');

// 북마크 추가하기
router.post('/toggle/:id', isLoggedIn, async (req, res, next) => {
    try {
        const plan = await Plan.findOne({ 
            where: { id: req.params.id, userId: req.user.id } 
        });

        if (!plan) {
            return res.status(404).json({ message: "플래너를 찾을 수 없습니다." });
        }

        const updatedMark = plan.isMarked === 1 ? 0 : 1;
        
        await Plan.update(
            { isMarked: updatedMark },
            { where: { id: req.params.id, userId: req.user.id } }
        );

        res.json({ success: true, isMarked: updatedMark });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 북마크 전체 리스트 보기
router.get('/readList', isLoggedIn, async (req, res, next) => {
    try {
        const plans = await Plan.findAll({
            where: { isMarked: 1, userId: req.user.id },
            include: [{
                model: User,
                attributes: ['name']
            }],
            order: [['createdAt', 'DESC']]
        });

        const formattedPlans = plans.map(p => ({
            id: p.id,
            title: p.planName, 
            writer: p.User ? p.User.name : '익명', 
            likes: p.likes,
            place: p.place,
            startDate: p.startDate,
            endDate: p.endDate,
            hotel: p.hotel,
            purpose: p.purpose,
            description: p.description,
            isMarked: p.isMarked
        }));

        res.json(formattedPlans);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 북마크 상세보기
router.get('/view/:id', async (req, res, next) => {
    try {
        const plan = await Plan.findOne({
            where: { id: req.params.id, userId: req.user.id, isMarked: 1 },
            attributes: [
                'id', 
                ['planName', 'name'],
                'startDate', 
                'endDate',
                ['personnel', 'peoples'], 
                ['purpose', 'perpose'], 
                'place', 
                'hotel',
                'description',
                'userId',
                'likes',
                'isMarked',
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

module.exports = router;
