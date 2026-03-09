import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes, FaEdit, FaTrash, FaShareAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../css/MyPlanner.css'

function MyPlanner() {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getPlans = async () => {
            try {
                const res = await axios.get('http://localhost:8002/myPlanner/readList', {
                    withCredentials: true
                });
                setPlans(res.data);
            } catch (err) {
                console.error("플래너 로드 실패:", err);
                if (err.res && err.res.status === 403) {
                    alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
                }
            }
        };
        getPlans();
    }, []);

    const handleEdit = (plan) => {
        navigate('/edit', { state: { planData: plan } });
    };

    const handleShare = async (plan) => {
    try {
        const res = await axios.post('http://localhost:8002/myPlanner/share', {
            id: plan.id,
            name: plan.name
        }, {
            withCredentials: true 
        });
        
        if (res.data.success) alert("공유 성공!");
    } catch (err) {
        alert(err.response?.data?.message || "공유 실패");
    }
};

    const handleDelete = async (id) => {
        if (window.confirm("정말 이 플래너를 삭제하시겠습니까?")) {
            try {
                const res = await axios.delete(`http://localhost:8002/myPlanner/delete/${id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    alert("삭제되었습니다.");
                    setPlans(plans.filter(plan => plan.id !== id));
                    setSelectedPlan(null);
                }
            } catch (err) {
                console.error("삭제 실패:", err);
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return dateStr.split('T')[0]; // '2026-03-09T00:00:00' -> '2026-03-09'
    };

    return (
        <div className='myPlanner'>
            <div className='myPlanner_outLineBox'>
                <div className='myPlanner_content'>
                    <div className='content_box'>
                        <div className='title_wrap'>
                            <div className='content_title'>
                                <div className='myPlanner_title'>내 플래너</div>
                            </div>
                        </div>
                        <div className='list_wrap'>
                            <div className='list_box'>
                                {plans.length > 0 ? (
                                    plans.map((plan, index) => (
                                        <div key={index} className='planner_item'>
                                            <div className='planner_header'>
                                                <span className='planner_name'>{plan.name}</span>
                                            </div>
                                            <div className='planner_info'>
                                                <div className='info_row'>
                                                    <span className='label'>📅 날짜:</span>
                                                    <span className='value'>{formatDate(plan.startDate)} ~ {formatDate(plan.endDate)}</span>
                                                </div>
                                                <div className='info_row'>
                                                    <span className='label'>📍 장소:</span>
                                                    <span className='value'>{plan.place}</span>
                                                </div>
                                            </div>
                                            <div className='planner_footer'>
                                                {/* 💡 버튼 클릭 시 selectedPlan 설정 */}
                                                <button 
                                                    className='detail_btn' 
                                                    onClick={() => setSelectedPlan(plan)}
                                                >
                                                    상세 보기
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='no_list'>
                                        <p>아직 생성된 플래너가 없습니다.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 상세 보기 팝업 */}
            {selectedPlan && (
                <div className='modal_overlay' onClick={() => setSelectedPlan(null)}>
                    <div className='modal_content scale_up' onClick={(e) => e.stopPropagation()}>
                        <button className='close_btn' onClick={() => setSelectedPlan(null)}>
                            <FaTimes />
                        </button>

                        <div className='modal_header'>
                            <div className='modal_category'>{selectedPlan.place}</div>
                            <h2>{selectedPlan.name}</h2>
                            <p className='modal_date'>📅 {selectedPlan.startDate} ~ {selectedPlan.endDate}</p>
                        </div>

                        <div className='modal_body'>
                            <div className='info_section'>
                                <p><strong>👥 인원:</strong> {selectedPlan.peoples}명</p>
                                <p><strong>📍 장소:</strong> {selectedPlan.place || '정보 없음'}</p>
                                <p><strong>🏨 숙소:</strong> {selectedPlan.hotel || '정보 없음'}</p>
                                <p>
                                    <strong>📢 공유 여부:</strong> 
                                    {(selectedPlan.isShared === 1 || selectedPlan.isShared === true || selectedPlan.isShared === "1") 
                                        ? "공개" : "비공개"}
                                    {(selectedPlan.isShared === 1 || selectedPlan.isShared === true) && ` (❤️ ${selectedPlan.likes || 0})`}
                                </p>
                            </div>
                            <div className='description_section'>
                                <p><strong>🎯 목적:</strong> {selectedPlan.perpose || selectedPlan.purpose || "설정된 목적이 없습니다."}</p>
                                <p><strong>📋 메모:</strong> {selectedPlan.perpose || "기록된 목적이나 메모가 없습니다."}</p>
                            </div>
                        </div>

                        {/* 내 플래너 관리 버튼 */}
                        <div className='modal_footer'>
                            <button className='edit_btn' onClick={() => handleEdit(selectedPlan)}>
                                <FaEdit /> 수정
                            </button>
                            <button className='share_btn'><FaShareAlt /> 공유</button>
                            <button className='delete_btn' onClick={() => handleDelete(selectedPlan.id)}>
                                <FaTrash /> 삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyPlanner;