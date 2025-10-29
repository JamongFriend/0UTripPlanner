// API 엔드포인트   데이터베이스에서 정보를 조회하여 JSON 형식으로 응답을 반환
const express = require('express');
const { User, Comment } = require('../models');

const router = express.Router();

// GET /users - 사용자 목록 반환
router.get('/users', async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'description']
        });
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
        next(err);
    }
});

// GET /comments - 댓글 목록 반환
router.get('/comments', async (req, res, next) => {
    try {
        const comments = await Comment.findAll({});
        res.status(200).json({ success: true, data: comments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
        next(err);
    }
});

// GET /data - 사용자와 관련된 댓글 데이터를 포함한 정보 반환
router.get('/data', async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'description'],
            include: {
                model: Comment,
                attributes: ['id', 'comment']
            }
        });
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
        next(err);
    }
});

module.exports = router;