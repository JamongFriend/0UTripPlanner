const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { logout } = require('./helpers');

const router = express.Router();

// 회원가입 페이지 또는 회원가입 처리
router.route('/')
    .get(async (req, res, next) => {
        try {
            const users = await User.findAll({
                attributes: ['id']
            });

            res.render('user', {
                title: require('../package.json').name,
                port: process.env.PORT,
                users: users.map(user => user.id)
            });
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        const { id, password, name, description } = req.body;

        try {
            const user = await User.findOne({ where: { id } });
            if (user) {
                res.status(400).send('이미 등록된 사용자 아이디입니다.');
                return;
            }

            const hash = await bcrypt.hash(password, 12);
            await User.create({
                id,
                password: hash,
                name,
                description
            });

            res.redirect('/');
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

const twilio = require(twilio);
const client = new twilio(accountSid, authToken);

router.post('/send-sms', async(req, res, next) => {
    const {phoneNum} = req.body;

    client.messages.create({
        body: '인증 코드: 123456',
        to: phoneNumber,
        from: '+1234567890',
    })
    .then((messages) => {
        res.status(200).json({success: true}); 
    })
    .catch((error) => {
        res.status(500).json({success: false, error: error.messages});
    })
})

// 사용자 정보 업데이트
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

// 사용자 삭제
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
