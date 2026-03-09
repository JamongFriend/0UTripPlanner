import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Main.css';

function Main() {
  return (
    <div className="main_container">
      {/* 1. 히어로 섹션 */}
      <section className="hero_section">
        <div className="hero_content">
          <h1>당신의 완벽한 여행 파트너, 0U Trip</h1>
          <p>복잡한 여행 계획, 이제 한 번에 해결하세요.</p>
          <Link to="/Create" className="start_btn">지금 바로 시작하기</Link>
        </div>
      </section>

      {/* 2. 주요 기능 카드 섹션 */}
      <section className="feature_section">
        <div className="section_title">주요 기능</div>
        <div className="feature_grid">
          <div className="feature_card">
            <div className="icon">🗺️</div>
            <h3>스마트 플래너</h3>
            <p>지도와 연동하여 동선을 한눈에 파악하세요.</p>
          </div>
          <div className="feature_card">
            <div className="icon">🤝</div>
            <h3>플래너 공유</h3>
            <p>친구들과 계획을 공유하고 함께 수정하세요.</p>
          </div>
          <div className="feature_card">
            <div className="icon">✨</div>
            <h3>여행지 추천</h3>
            <p>취향에 맞는 최적의 장소를 추천해 드립니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Main;