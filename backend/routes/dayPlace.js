// 일별 방문 장소 관리

const express = require('express');
const router = express.Router();
const { DayPlace, Plan } = require('../models');
const { isLoggedIn } = require('./helpers');

// 장소 추가
router.post('/create', isLoggedIn, async (req, res, next) => {
    const { planId, day, time, title, category, placeName, address, latitude, longitude } = req.body;
    try {
        const plan = await Plan.findOne({ where: { id: planId, userId: req.user.id } });
        if (!plan) return res.status(404).json({ message: '플래너를 찾을 수 없습니다.' });

        const dayPlace = await DayPlace.create({
            planId,
            day,
            time,
            title,
            category,
            placeName,
            address,
            latitude,
            longitude
        });
        res.status(201).json({ success: true, data: dayPlace });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 특정 플랜의 장소 목록 조회 (일차별 정렬)
router.get('/list/:planId', isLoggedIn, async (req, res, next) => {
    try {
        const plan = await Plan.findOne({ where: { id: req.params.planId, userId: req.user.id } });
        if (!plan) return res.status(404).json({ message: '플래너를 찾을 수 없습니다.' });

        const places = await DayPlace.findAll({
            where: { planId: req.params.planId },
            order: [['day', 'ASC'], ['visitOrder', 'ASC']]
        });
        res.json(places);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 장소 수정
router.put('/edit/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { placeName, address, latitude, longitude, day, visitOrder } = req.body;

        // 본인 플래너의 장소인지 확인
        const dayPlace = await DayPlace.findOne({
            where: { id: req.params.id },
            include: [{ model: Plan, as: 'Plan', where: { userId: req.user.id } }]
        });
        if (!dayPlace) return res.status(404).json({ message: '장소를 찾을 수 없습니다.' });

        await DayPlace.update(
            { placeName, address, latitude, longitude, day, visitOrder },
            { where: { id: req.params.id } }
        );
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 장소 삭제
router.delete('/delete/:id', isLoggedIn, async (req, res, next) => {
    try {
        const dayPlace = await DayPlace.findOne({
            where: { id: req.params.id },
            include: [{ model: Plan, as: 'Plan', where: { userId: req.user.id } }]
        });
        if (!dayPlace) return res.status(404).json({ message: '장소를 찾을 수 없습니다.' });

        await DayPlace.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
