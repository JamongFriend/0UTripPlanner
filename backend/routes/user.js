const express = require('express');
const User = require('../models/user');
const { logout } = require('./helpers');

const router = express.Router();

// 사용자 정보 수정
router.post('/update', async (req, res, next) => {
    try {
        const result = await User.update({
            name: req.body.name
        }, {
            where: { id: req.body.id }
        });

        if (result) res.redirect('/');
        else res.status(404).send(`There is no user with ${req.body.id}.`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 회원 탈퇴
router.get('/delete/:id', async (req, res, next) => {
    try {
        const result = await User.destroy({
            where: { id: req.params.id }
        });

        if (result) {
            logout(req, res);
            res.redirect('/login');
        } else {
            res.status(404).send(`There is no user with ${req.params.id}.`);
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// 특정 사용자 정보 조회
router.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { id: req.params.id },
            attributes: ['id', 'name']
        });

        if (user) res.json(user);
        else res.status(404).send(`There is no user with ${req.params.id}.`);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
