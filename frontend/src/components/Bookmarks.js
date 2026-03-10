import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Share.css'; // 기존 공유페이지 스타일 재사용
import { FaSearch, FaHeart, FaTimes, FaBookmark } from 'react-icons/fa';

function BookMark() {
  const [markedPlans, setMarkedPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  // 1. 북마크 리스트 불러오기
  useEffect(() => {
    const fetchMarkedPlans = async () => {
      try {
        const res = await axios.get('http://localhost:8002/bookMark/readList', { 
          withCredentials: true 
        });
        setMarkedPlans(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("북마크 로드 실패:", err);
      }
    };
    fetchMarkedPlans();
  }, []);

  // 2. 북마크 해제 (Toggle)
  const handleRemoveBookmark = async (id) => {
    if (!window.confirm("북마크를 해제하시겠습니까?")) return;
    try {
      const res = await axios.post(`http://localhost:8002/bookMark/toggle/${id}`, {}, {
        withCredentials: true
      });
      if (res.data.success) {
        // 리스트에서 즉시 제거
        setMarkedPlans(markedPlans.filter(p => p.id !== id));
        setSelectedPlan(null);
        alert("북마크가 해제되었습니다.");
      }
    } catch (err) {
      alert("해제 실패");
    }
  };

  // 검색 필터링
  const filteredPlans = markedPlans.filter((plan) =>
    (plan.place && plan.place.includes(searchTerm)) || 
    (plan.title && plan.title.includes(searchTerm))
  );

  return (
    <div className='share_container'>
      <div className='share_header'>
        <h1>내 북마크</h1>
        <p>찜해두었던 나만의 여행 계획들을 확인하세요.</p>
        <div className='share_search_bar'>
          <input 
            type="text" 
            placeholder="장소 또는 제목 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='search_icon_btn'><FaSearch /></button>
        </div>
      </div>

      <div className='share_grid'>
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <div key={plan.id} className='share_card'>
              <div className='card_image' onClick={() => setSelectedPlan(plan)}>
                <div className='temp_img'>{plan.place}</div>
              </div>
              <div className='card_body'>
                <h3 className='plan_title'>{plan.title}</h3>
                <div className='plan_meta'>
                  <span>👤 {plan.writer}</span>
                  <span>❤️ {plan.likes}</span>
                </div>
                <button className='view_btn' onClick={() => setSelectedPlan(plan)}>상세 보기</button>
              </div>
            </div>
          ))
        ) : (
          <div className='no_results'>북마크한 계획이 없습니다.</div>
        )}
      </div>

      {/* 상세 보기 모달 */}
      {selectedPlan && (
        <div className='modal_overlay' onClick={() => setSelectedPlan(null)}>
          <div className='modal_content scale_up' onClick={(e) => e.stopPropagation()}>
            <button className='close_btn' onClick={() => setSelectedPlan(null)}><FaTimes /></button>
            <div className='modal_header'>
              <div className='modal_category'>{selectedPlan.place}</div>
              <h2>{selectedPlan.title}</h2>
            </div>
            <div className='modal_body'>
              <div className='info_section'>
                <p><strong>작성자:</strong> {selectedPlan.writer}</p>
                <p><strong>📅 기간:</strong> {selectedPlan.startDate?.split('T')[0]} ~ {selectedPlan.endDate?.split('T')[0]}</p>
                <p><strong>🏨 숙소:</strong> {selectedPlan.hotel || '정보 없음'}</p>
              </div>
              <div className='description_section'>
                <p><strong>🎯 목적:</strong> {selectedPlan.purpose || "정보 없음"}</p>
                <p>{selectedPlan.description}</p>
              </div>
            </div>
            <div className='modal_footer'>
              <button className='import_btn' onClick={() => handleRemoveBookmark(selectedPlan.id)}>
                <FaBookmark style={{color: '#ffc107'}} /> 북마크 해제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookMark;