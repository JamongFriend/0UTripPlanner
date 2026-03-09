//사용자 인증 관련 기능(로그인, 로그아웃, Kakao 로그인)

const express = require('express');
const passport = require('passport');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { logout } = require('./helpers');

const router = express.Router();

// POST /login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            return res.status(500).json({ error: 'Authentication error' });
        }
        if (!user) {
            return res.status(401).json({ error: info.message || 'Invalid credentials' });
        }
        req.login(user, loginError => {
            if (loginError) {
                return res.status(500).json({ error: 'Login error' });
            }
            res.json({ success: true, message: 'Login successful', user });
        });
    })(req, res, next);
});

// POST /logout
router.post('/logout', (req, res, next) => {
    console.log("1. [서버] 로그아웃 라우터 진입함!");
    req.user = null;
    req.session.destroy((err) => {
        if (err) {
            console.error("2. [에러] 세션 파괴 실패:", err);
            return res.status(500).json({ success: false });
        }

        res.clearCookie('session-cookie', { 
            path: '/',
            httpOnly: true 
        });

        console.log("--- 로그아웃 완료: 세션 삭제 성공 ---");
        return res.status(200).json({ success: true });
    });
});

// GET /kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /kakao/callback
router.get('/kakao/callback',
    passport.authenticate('kakao', { failureRedirect: '/?error=login_failed' }),
    (req, res) => {
        res.json({ success: true, message: 'Kakao login successful', user: req.user });
    }
);

// 아이디 중복확인
router.get('/check-id/:id', async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (user) {
            return res.json({ success: false, message: '이미 사용 중인 아이디입니다.' });
        }
        res.json({ success: true, message: '사용 가능한 아이디입니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

// 회원가입 처리
router.post('/register', async (req, res, next) => {
    const { id, password, name, email, phone } = req.body;

    try {
        const exUser = await User.findOne({ where: { id } });
        if (exUser) {
            return res.status(400).json({ success: false, message: '이미 등록된 아이디입니다.' });
        }

        const hash = await bcrypt.hash(password, 12);
        await User.create({
            id,
            password: hash,
            name,
            email,
            phoneNum : phone
        });

        res.status(201).json({ success: true, message: '회원가입이 완료되었습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: '회원가입 중 에러가 발생했습니다.' });
    }
});

// 1. 인증번호 발송
router.post('/send-code', async (req, res) => {
    try {
        const { phone } = req.body;
        let verificationCode;

        // 테스트를 위한 고정 번호 설정 (예: '01012341234'이거나 특정 조건일 때)
        if (phone === '01012341234' || process.env.NODE_ENV === 'development') {
            verificationCode = '123456'; // 테스트용 고정 번호
            console.log(`[TEST MODE] 고정 인증번호 사용: ${verificationCode}`);
        } else {
            // 실제 서비스 시 랜덤 번호 생성
            verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        }
        
        req.session.smsCode = verificationCode;
        req.session.phone = phone;

        console.log(`[테스트용] ${phone} 인증번호: ${verificationCode}`);
        
        res.json({ success: true, message: "인증번호가 전송되었습니다." });
    } catch (err) {
        next(err);
    }
});

// 2. 인증번호 검증
router.post('/verify-code', (req, res) => {
    const { checkPhone } = req.body;

    console.log("세션에 저장된 번호:", req.session.smsCode);
    console.log("사용자가 입력한 번호:", checkPhone);
    console.log("세션 ID:", req.sessionID);

    if (req.session.smsCode && req.session.smsCode === checkPhone) {
        return res.json({ success: true, message: "인증에 성공했습니다." });
    }
    
    res.status(400).json({ success: false, message: "인증번호가 일치하지 않습니다." });
});

router.get('/status', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    console.log("--- Status 체크 시작 ---");
    console.log("인증 여부:", req.isAuthenticated());

    if (req.isAuthenticated() && req.user) {
        return res.json({ 
            success: true, 
            isLoggedIn: true, 
            user: { 
                id: req.user.id,
                name: req.user.name 
            }
        });
    }
    res.json({ success: false, isLoggedIn: false });
});

module.exports = router;
