//Express 미들웨어와 컨트롤러를 활용해 로그인 여부를 판단하고, 로그아웃 처리를 수행하는 기능

// 로그인 여부 확인 미들웨어
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(403).json({ error: '로그인 필요', code: 403 });
};

// 비로그인 여부 확인 미들웨어
exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect(req.session.returnTo || '/');
};

// 로그아웃 처리
exports.logout = (req, res) => {
    req.logout(err => {
        if (err) return next(err);
        req.session.destroy(err => {
            if (err) return next(err);
            res.redirect('/');
        });
    });
};

// 관리자 권한 확인 미들웨어
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('관리자 권한 필요');
};
