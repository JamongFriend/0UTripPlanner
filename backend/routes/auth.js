//사용자 인증 관련 기능(로그인, 로그아웃, Kakao 로그인)

const express = require('express');
const passport = require('passport');
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

// GET /logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: 'Session destruction failed' });
            }
            res.json({ success: true, message: 'Logout successful' });
        });
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

    if (req.session.smsCode && req.session.smsCode === checkPhone) {
        req.session.isPhoneVerified = true;
        return res.json({ success: true, message: "인증에 성공했습니다." });
    }
    
    res.status(400).json({ success: false, message: "인증번호가 일치하지 않습니다." });
});

module.exports = router;
