//여행계획 관리 기능

const express = require('express');
const Plan = require('../models/plan');
const { isLoggedIn } = require('./helpers');

const router = express.Router();

// 생성
router.post('/create', isLoggedIn, async (req, res, next) => {
    const { planName, startDate, endDate, personnel, purpose, description, place, hotel, isShared, isMarked } = req.body;
    try {
        await Plan.create({
            id: `plan_${Date.now()}`, 
            planName,
            startDate,
            endDate,
            personnel,
            purpose,
            place,
            hotel,
            description,
            isShared: isShared ? 1 : 0,
            isMarked: isMarked ? 1 : 0,
            userId: req.user.id
        });
        res.json({ success: true, message: '플래너 생성 성공' });
    } catch (err) {
        console.error(err);
        next(err);
    }
})

// 수정
router.post('/edit/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { planName, startDate, endDate, personnel, purpose, place, hotel, description, isShared } = req.body;
        console.log("백엔드가 실제 받은 데이터:", req.body);
        const result = await Plan.update({
            planName,
            startDate,
            endDate,
            personnel,
            purpose,
            place,
            hotel,
            description,
            isShared: Number(isShared),
        }, {
            where: { 
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (result[0] > 0) res.json({ success: true });
        else res.status(404).json({ message: '계획을 찾을 수 없습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 여행 계획 삭제
router.delete('/delete/:id', isLoggedIn, async (req, res, next) => {
    try {
        const result = await Plan.destroy({
            where: { 
                id: req.params.id,
                userId: req.user.id 
            }
        });
        if (result) res.json({ success: true });
        else res.status(404).json({ message: '삭제할 계획이 없습니다.' });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 전체 목록 조회
router.get('/readList', isLoggedIn, async (req, res, next) => {
    try {
        const plans = await Plan.findAll({
            where: { userId: req.user.id },
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
                'isShared',
                'isMarked',
                'likes'
            ]
        });
        res.json(plans);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 여행 계획 상세보기
router.get('/readPlan/:name', async (req, res, next) => {
    try {
        const plan = await Plan.findOne({
            where: { planName: req.params.name },
            attributes: [
                'id', 
                ['planName', 'name'], 
                ['startDate', 'date'], 
                ['personnel', 'peoples'], 
                ['purpose', 'perpose'], 
                'place', 
                'hotel'
            ]
        });

        if (plan) res.json(plan);
        else next(`There is no plan with the name ${req.params.name}.`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/map-data', async (req, res, next) => {
    try {
        res.json({
            lat: 33.450701,
            lng: 126.570667
        });
    } catch (err) {
        next(err);
    }
});

//지도 출력
router.get('/map', async (req, res, next)=> {
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };
    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption); 
    
})

module.exports = router;