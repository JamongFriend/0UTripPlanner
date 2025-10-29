//여행계획 관리 기능

const express = require('express');
const Plan = require('../models/plan');
const { isLoggedIn } = require('./helpers');

const router = express.Router();

// 자신의 여행 계획 리스트 확인
router.get('/readList', async (req, res, next) => {
    try {
        const plans = await Plan.findAll({
            attributes: ['name', 'date', 'peoples', 'perpose', 'place', 'hotel']
        });
        res.json(plans);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 여행 계획 출력
router.get('/readPlan/:name', async (req, res, next) => {
    try {
        const plan = await Plan.findOne({
            where: { name: req.params.name },
            attributes: ['id', 'name', 'date', 'peoples', 'perpose', 'place', 'hotel']
        });

        if (plan) res.json(plan);  // 여행 계획을 JSON 형태로 반환
        else next(`There is no plan with the name ${req.params.name}.`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 여행 계획 수정
router.post('/update/:name', async (req, res, next) => {
    try {
        const result = await Plan.update({
            name: req.body.name,
            date: req.body.date,
            peoples: req.body.peoples,
            perpose: req.body.perpose,
            place: req.body.place,
            hotel: req.body.hotel
        }, {
            where: { name: req.params.name }
        });

        if (result[0] > 0) res.redirect('/');
        else next(`There is no plan with the name ${req.params.name}.`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 여행 계획 삭제
router.delete('/delete/:plan', async (req, res, next) => {
    try {
        const result = await Plan.destroy({
            where: { name: req.params.plan }
        });

        if (result) res.redirect('/');
        else next(`There is no plan with the name ${req.params.plan}.`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;