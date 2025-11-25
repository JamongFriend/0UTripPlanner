const path = require('path');

const dotenv = require('dotenv');

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

const nunjucks = require('nunjucks');
const { sequelize } = require('./models');

const passport = require('passport');
const passportConfig = require('./passport');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const indexRouter = require('./routes');
const createrRouter = require('./routes/creater');
const managerRouter = require('./routes/manager');
const shareRouter = require('./routes/share');
const suggestRouter = require('./routes/suggest');

//env 파일 로드
dotenv.config();
passportConfig();

//express 앱 생성성
const app = express();
app.set('port', process.env.PORT || 3000);

//Nunjucks 템플릿 엔진 설정
app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true,
});

// Sequelize 데이터베이스 연결
sequelize.sync({ force: false })
    .then(() => console.log('데이터베이스 연결 성공'))
    .catch(err => console.error(err));

// 요청 미들웨어 설정
app.use(
    morgan('dev'),
    express.static(path.join(__dirname, 'public')),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.SECRET),
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SECRET,
        cookie: {
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie'
    })
);

// CORS 설정
app.use(cors({
    origin: 'http://localhost:3000', // React 개발 서버의 주소
    methods: 'GET,POST,PUT,DELETE',  // 사용할 HTTP 메소드 설정
    credentials: true, // 필요시 쿠키도 공유할 수 있도록 설정
}));

// passport설정
app.use(passport.initialize());
app.use(passport.session());

// 라우터 설정
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);
app.use('/', indexRouter);
app.use('/creater', createrRouter);
app.use('/manager', managerRouter);
app.use('/share', shareRouter);
app.use('/suggest', suggestRouter);

app.use(express.static(path.join(__dirname, '../frontend/build')));

// 기본 경로에서 리액트앱 제공
app.use((req, res) =>
    res.render('index', {
        title: require('./package.json').name,
        port: app.get('port'),
        user: req.user
    })
);

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
