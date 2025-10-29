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

module.exports = router;
