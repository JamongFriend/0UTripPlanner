import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Share.css';
import { FaSearch, FaHeart, FaDownload, FaTimes, FaBookmark, FaRegBookmark } from 'react-icons/fa';

function Share() {
  const [sharedPlans, setSharedPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  // 샘플 데이터 (나중에 DB 연동 시 삭제)
  const dummyData = [
    { id: 1, title: '제주도 3박 4일 힐링 코스', writer: '여행가A', likes: 120, place: '제주도' },
    { id: 2, title: '서울 맛집 도장깨기', writer: '푸드파이터', likes: 85, place: '서울' },
    { id: 3, title: '부산 밤바다 드라이브', writer: '부산갈매기', likes: 230, place: '부산' },
  ];

  useEffect(() => {
    const fetchSharedPlans = async () => {
      try {
        const res = await axios.get('http://localhost:8002/share/readList', { 
          withCredentials: true 
        });
        if (Array.isArray(res.data)) {
          setSharedPlans(res.data);
        } else {
          console.error("서버에서 배열이 아닌 데이터를 보냈습니다:", res.data);
          setSharedPlans([]); // HTML 등이 오면 빈 배열로 초기화
        }
      } catch (err) {
        console.error("공유 목록 로드 실패:", err);
        setSharedPlans([]);
      }
    };
    fetchSharedPlans();
    // setSharedPlans(dummyData);
  }, []);

  const handleImport = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8002/share/getPlan/${id}`, {}, {
        withCredentials: true 
      });
      if (res.data.success) {
        alert('내 플래너로 가져왔습니다!');
        setSelectedPlan(null);
      }
    } catch (err) {
      console.error("가져오기 실패:", err);
      alert('이미 가져온 플래너이거나 가져오기에 실패했습니다.');
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8002/share/like/${id}`, {}, {
        withCredentials: true 
      });
      if (res.data.success) {
        const updatedPlans = sharedPlans.map(p => 
          p.id === id ? { ...p, likes: p.likes + 1 } : p
        );
        setSharedPlans(updatedPlans);
        
        if (selectedPlan && selectedPlan.id === id) {
          setSelectedPlan({ ...selectedPlan, likes: selectedPlan.likes + 1 });
        }
      }
    } catch (err) {
      console.error("좋아요 실패:", err);
    }
  };

  const handleBookmarkToggle = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8002/bookMark/toggle/${id}`, {}, {
        withCredentials: true
      });
      
      if (res.data.success) {
        const updatedPlans = sharedPlans.map(p => 
            p.id === id ? { ...p, isMarked: res.data.isMarked } : p
        );
        setSharedPlans(updatedPlans);
        
        if (selectedPlan && selectedPlan.id === id) {
            setSelectedPlan({ ...selectedPlan, isMarked: res.data.isMarked });
        }
        
        alert(res.data.isMarked ? "북마크 되었습니다!" : "북마크가 해제되었습니다.");
      }
    } catch (err) {
        console.error("북마크 실패:", err);
        alert("로그인이 필요하거나 북마크 처리에 실패했습니다.");
    }
  };

  const filteredPlans = sharedPlans.filter((plan) =>
    (plan.place && plan.place.includes(searchTerm)) || 
    (plan.title && plan.title.includes(searchTerm))
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.split('T')[0];
};

  return (
    <div className='share_container'>
      <div className='share_header'>
        <h1>플래너 공유</h1>
        <p>다른 사용자들의 멋진 여행 계획을 확인해보세요.</p>
        
        {/* 장소 검색창 */}
        <div className='share_search_bar'>
          <input 
            type="text" 
            placeholder="어디로 떠나고 싶으신가요?"
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
              <div className='card_image'>
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
          <div className='no_results'>검색 결과가 없습니다.</div>
        )}
      </div>
      {/* 상세 정보 팝업 */}
      {selectedPlan && (
        <div className='modal_overlay' onClick={() => setSelectedPlan(null)}>
          {/* modal_content에 'active' 클래스나 애니메이션 효과를 부여합니다 */}
          <div className='modal_content scale_up' onClick={(e) => e.stopPropagation()}>
            <button className='close_btn' onClick={() => setSelectedPlan(null)}><FaTimes /></button>
            
            <div className='modal_header'>
              <div className='modal_category'>{selectedPlan.place}</div>
              <h2>{selectedPlan.title}</h2>
            </div>

            <div className='modal_body'>
              <div className='info_section'>
                <p><strong>작성자:</strong> {selectedPlan.writer}</p>
                <p><strong>📅 여행 기간:</strong> {formatDate(selectedPlan.startDate)} ~ {formatDate(selectedPlan.endDate)}</p>
                <p><strong>📍 장소:</strong> {selectedPlan.place || '정보 없음'}</p>
                <p><strong>🎯 목적:</strong> {selectedPlan.purpose || "정보 없음"}</p>
                {selectedPlan.description && <p><strong>📋 메모:</strong> {selectedPlan.description}</p>}
              </div>
              {selectedPlan.dayPlaces && selectedPlan.dayPlaces.length > 0 && (
                <div className='timeline_section'>
                  <strong>📆 일정</strong>
                  {[...new Set(selectedPlan.dayPlaces.map(p => p.day))].sort((a,b) => a-b).map(day => (
                    <div key={day} className='modal_day_group'>
                      <div className='modal_day_label'>{day}일차</div>
                      {selectedPlan.dayPlaces
                        .filter(p => p.day === day)
                        .map((p, i) => (
                          <div key={i} className='modal_timeline_item'>
                            <span className='modal_time'>{p.time || '--:--'}</span>
                            <span className='modal_title'>{p.title}</span>
                            {p.placeName && <span className='modal_place'>📍 {p.placeName}</span>}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='modal_footer'>
              <button className='like_btn' onClick={() => handleLike(selectedPlan.id)}>
                  <FaHeart /> {selectedPlan.likes}
              </button>
              <button className='bookmark_btn' onClick={() => handleBookmarkToggle(selectedPlan.id)}>
                  {selectedPlan.isMarked ? <FaBookmark style={{color: '#ffc107'}}/> : <FaRegBookmark />} 북마크
              </button>
              <button className='import_btn' onClick={() => handleImport(selectedPlan.id)}>
                  <FaDownload /> 내 플래너로 가져오기
              </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Share;