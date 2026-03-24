# 0UTripPlanner Server

나만의 여행 계획을 세우고 타인과 공유하는 **0UTripPlanner**의 백엔드 서버 레포지토리입니다.  
사용자 맞춤형 일정 생성, Kakao Maps API 기반 장소 검색, 북마크 및 플래너 공유 기능을 제공하는 RESTful 여행 플랫폼입니다.

---

## 🧩 주요 기능

### 1. 스마트 플래너 관리 (Core)
* **일정 커스터마이징**: 여행지, 숙소, 인원, 목적 등을 포함한 상세 플래너 생성 및 관리
* **가져오기 시스템(Import)**: 공유된 타인의 플래너를 내 보관함으로 복사하여 자유로운 2차 수정 지원
* **북마크 시스템**: `isMarked` 플래그를 활용한 개인별 중요 일정 찜 기능

### 2. 소셜 및 공유 기능
* **전략적 공유 상태**: `isShared` 상태값을 이용한 공개 게시판 등록 및 비공개 전환 제어
* **상호작용**: 공유 플래너 대상 '좋아요(Likes)' 카운팅 및 작성자 정보(User Join) 연동

### 3. 위치 기반 서비스 (LBS)
* **지도 인터페이스**: Kakao Maps SDK를 활용한 실시간 위치 렌더링 및 마커 표시
* **키워드 검색**: 장소 검색 및 연관 검색어 리스트 제공, 클릭 시 해당 좌표로 부드러운 이동(PanTo)
* **추천 시스템**: (예정) 공공데이터(TourAPI) 기반 지역별 맞춤형 여행지 추천 로직

### 4. 인증 및 보안
* **Passport.js**: Session 기반의 검증된 유저 인증 및 역직렬화(Deserialize) 처리
* **접근 제어**: `isLoggedIn` 커스텀 미들웨어를 통한 API 보호 및 비로그인 사용자 차단

---

## 🛠 기술 스택

### 🎨 Frontend
- **Library**: React 18+
- **Styling**: CSS3 (Custom Modules)
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Axios
- **Icons**: React-Icons
- **Maps API**: Kakao Maps SDK

### ⚙️ Backend
- **Language**: JavaScript (Node.js 20+)
- **Framework**: Express.js 4.x
- **ORM**: Sequelize
- **Database**: MySQL 8.0
- **Auth**: Passport.js (Session-based)

---

## 📁 프로젝트 구조

```text
Project.0UTripPlanner
├── models               # Sequelize 엔티티 정의 및 테이블 관계 설정
│   ├── index.js         # 데이터베이스 연결 및 모델 초기화
│   ├── user.js          # 회원 정보 및 계정 권한 도메인
│   └── plan.js          # 여행 계획, 공유 상태, 북마크 핵심 도메인
├── routes               # 컨트롤러 및 API 엔드포인트 분리
│   ├── auth.js          # 회원가입, 로그인/로그아웃 인증 로직
│   ├── share.js         # 공유 게시판 조회 및 좋아요/가져오기 처리
│   ├── bookMark.js      # 개인 북마크 리스트 및 토글(Toggle) 기능
│   └── myPlanner.js     # 개인 플래너 CRUD 및 관리 로직
├── passport             # 인증 전략(Local Strategy) 및 세션 처리
├── public               # 정적 파일 및 클라이언트 사이드 리소스
└── views                # 서버 사이드 렌더링용 Nunjucks 템플릿
```

---

## 🚀 시작하기 (Getting Started)

### 1. 필수 요구사항 (Prerequisites)
- **Node.js**: v20.x 이상 권장
- **MySQL**: v8.0 이상
- **Kakao Maps API Key**: [카카오 개발자 콘솔](https://developers.kakao.com/)에서 발급 필요

### 2. 설치 및 환경 설정 (Installation)
```bash
# 레포지토리 클론
git clone [https://github.com/사용자계정/0UTripPlanner.git](https://github.com/사용자계정/0UTripPlanner.git)
cd 0UTripPlanner

# 의존성 패키지 설치
npm install
```

## 🔐 환경 변수 설정 (.env)
- NODE_ENV: 개발 모드 설정
- COOKIE_SECRET: 세션 암호화 키
- DB_PASSWORD: MySQL 비밀번호
- KAKAO_ID: 카카오 JavaScript/REST API 키
