import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import axios from 'axios';
import '../css/Create.css';

const CATEGORY_ICONS = { '이동': '🚗', '숙소': '🏨', '식사': '🍽', '관광': '🗺', '기타': '📌' };

function Edit() {
    const location = useLocation();
    const navigate = useNavigate();
    const planData = location.state?.planData;

    const [formData, setFormData] = useState(null);
    const [isShared, setIsShared] = useState(false);

    // Step 관련
    const [step, setStep] = useState(1);

    // Step2 관련
    const [currentDay, setCurrentDay] = useState(1);
    const [dayPlaces, setDayPlaces] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPlace, setNewPlace] = useState({
        time: '',
        title: '',
        category: '기타',
        placeName: '',
        address: ''
    });

    useEffect(() => {
        if (!planData) {
            alert("수정할 데이터가 없습니다. 목록으로 돌아갑니다.");
            navigate('/myPlanner');
            return;
        }

        setFormData({
            id: planData.id,
            planName: planData.name || planData.planName || "",
            startDate: planData.startDate ? new Date(planData.startDate) : new Date(),
            endDate: planData.endDate ? new Date(planData.endDate) : new Date(),
            personnel: planData.peoples || planData.personnel || 1,
            purpose: planData.perpose || planData.purpose || "",
            place: planData.place || "",
            description: planData.description || ""
        });

        setIsShared(planData.isShared === 1 || planData.isShared === true);

        // 기존 dayPlaces 불러오기
        if (planData.dayPlaces && planData.dayPlaces.length > 0) {
            setDayPlaces(planData.dayPlaces);
        }
    }, [planData, navigate]);

    useEffect(() => {
        if (step === 1 && window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map');
                if (container) {
                    const options = {
                        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                        level: 3
                    };
                    const map = new window.kakao.maps.Map(container, options);
                    setTimeout(() => map.relayout(), 0);
                }
            });
        }
    }, [step]);

    // 여행 일수 계산
    const dayCount = formData?.startDate && formData?.endDate
        ? Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1
        : 1;

    const handleDateChange = (date, name) => {
        setFormData({ ...formData, [name]: date });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Step1 완료 → 기본정보 수정 후 Step2 이동
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:8002/myPlanner/edit/${formData.id}`,
                { ...formData, isShared: isShared ? 1 : 0 },
                { withCredentials: true }
            );
            if (res.data.success) {
                setStep(2);
            }
        } catch (err) {
            console.error("수정 에러:", err);
            alert('수정에 실패했습니다.');
        }
    };

    // 일정 항목 추가
    const handleAddPlace = async () => {
        if (!newPlace.title.trim()) {
            alert('일정 제목을 입력하세요.');
            return;
        }
        try {
            const res = await axios.post('http://localhost:8002/dayPlace/create', {
                planId: formData.id,
                day: currentDay,
                ...newPlace
            }, { withCredentials: true });

            if (res.data.success) {
                setDayPlaces([...dayPlaces, { ...newPlace, day: currentDay, id: res.data.data.id }]);
                setNewPlace({ time: '', title: '', category: '기타', placeName: '', address: '' });
                setShowAddForm(false);
            }
        } catch (err) {
            console.error("일정 추가 에러:", err);
            alert('일정 추가에 실패했습니다.');
        }
    };

    // 일정 항목 삭제
    const handleDeletePlace = async (id) => {
        try {
            await axios.delete(`http://localhost:8002/dayPlace/delete/${id}`, { withCredentials: true });
            setDayPlaces(dayPlaces.filter(p => p.id !== id));
        } catch (err) {
            console.error("일정 삭제 에러:", err);
        }
    };

    // 현재 일차의 일정 (시간순 정렬)
    const currentDayPlaces = dayPlaces
        .filter(p => p.day === currentDay)
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    if (!formData) return <div>로딩 중...</div>;

    // ─── Step1: 기본 정보 수정 ───
    if (step === 1) {
        return (
            <div className='createPlan'>
                <form className='create_plan_outLineBox' onSubmit={handleUpdate}>
                    <div className='create_plan_content'>
                        <div className='content_box'>
                            <div className='content_title'><h2>플래너 수정</h2></div>

                            <div className='plan_name_wrap'>
                                <div className='content_title'>
                                    <div className='plan_name_title'>플래너 이름</div>
                                </div>
                                <div className='input_box'>
                                    <input type="text" name="planName" value={formData.planName} onChange={handleChange} placeholder="플래너 이름을 입력하세요" required />
                                </div>
                            </div>

                            <div className='plan_personnel_wrap'>
                                <div className='content_title'>
                                    <div className='plan_personnel_title'>여행 인원 수</div>
                                </div>
                                <div className='input_box'>
                                    <input type="number" name="personnel" value={formData.personnel} onChange={handleChange} min="1" />
                                </div>
                            </div>

                            <div className='plan_purpose_wrap'>
                                <div className='content_title'>
                                    <div className='plan_purpose_title'>여행 목적</div>
                                </div>
                                <div className='input_box'>
                                    <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="여행 목적을 입력하세요" />
                                </div>
                            </div>

                            <div className='plan_place_wrap'>
                                <div className='content_title'>
                                    <div className='plan_place_title'>여행 장소</div>
                                </div>
                                <div className='kakaoMap_wrap'>
                                    <div id='map' style={{ width: '100%', height: '300px', backgroundColor: '#eee' }}></div>
                                </div>
                                <div className='input_box'>
                                    <input type="text" name="place" value={formData.place} onChange={handleChange} placeholder="여행 장소를 입력하세요" />
                                </div>
                            </div>

                            <div className='plan_date_wrap'>
                                <div className='content_title'>
                                    <div className='plan_date_title'>여행 기간</div>
                                </div>
                                <div className='input_box'>
                                    <div className='date_partition'>
                                        <DatePicker
                                            selected={formData.startDate}
                                            onChange={(date) => handleDateChange(date, 'startDate')}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="YYYY-MM-DD"
                                            className="partition_input"
                                        />
                                    </div>
                                    <div className='date_separator'>~</div>
                                    <div className='date_partition'>
                                        <DatePicker
                                            selected={formData.endDate}
                                            onChange={(date) => handleDateChange(date, 'endDate')}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText="YYYY-MM-DD"
                                            className="partition_input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='plan_description_wrap'>
                                <div className='content_title'>
                                    <div className='plan_description_title'>플래너 설명</div>
                                </div>
                                <div className='input_description_box'>
                                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="플래너 설명을 입력하세요" style={{ width: '100%', height: '100px' }} />
                                </div>
                            </div>

                            <div className='share_check_wrap'>
                                <label className='share_checkbox_label'>
                                    <input
                                        type="checkbox"
                                        className='share_checkbox'
                                        checked={isShared}
                                        onChange={(e) => setIsShared(e.target.checked)}
                                    />
                                    <span>이 플래너를 공유 게시판에 게시하기</span>
                                </label>
                            </div>

                            <div className='create_plan_button_wrap'>
                                <button type="submit" className='create_plan_button'>
                                    다음 — 일정 수정
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    // ─── Step2: 일차별 타임라인 편집 ───
    return (
        <div className='createPlan'>
            <div className='create_plan_outLineBox'>
                <div className='create_plan_content'>
                    <div className='content_box'>

                        <div className='content_title'>
                            <h2>{formData.planName}</h2>
                            <p>{formData.place} · {dayCount - 1}박 {dayCount}일</p>
                        </div>

                        {/* 일차 탭 */}
                        <div className='day_tabs'>
                            {Array.from({ length: dayCount }, (_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    className={`day_tab ${currentDay === i + 1 ? 'active' : ''}`}
                                    onClick={() => { setCurrentDay(i + 1); setShowAddForm(false); }}
                                >
                                    {i + 1}일차
                                </button>
                            ))}
                        </div>

                        {/* 타임라인 */}
                        <div className='timeline_list'>
                            {currentDayPlaces.length === 0 ? (
                                <p className='no_schedule'>아직 추가된 일정이 없습니다.</p>
                            ) : (
                                currentDayPlaces.map((p) => (
                                    <div key={p.id} className='timeline_item'>
                                        <span className='timeline_time'>{p.time || '--:--'}</span>
                                        <span className='timeline_icon'>{CATEGORY_ICONS[p.category]}</span>
                                        <div className='timeline_info'>
                                            <span className='timeline_title'>{p.title}</span>
                                            {p.placeName && <span className='timeline_place'>{p.placeName}</span>}
                                        </div>
                                        <button
                                            type="button"
                                            className='timeline_delete_btn'
                                            onClick={() => handleDeletePlace(p.id)}
                                        >✕</button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* 일정 추가 폼 */}
                        {showAddForm && (
                            <div className='add_place_form'>
                                <input
                                    type="time"
                                    value={newPlace.time}
                                    onChange={(e) => setNewPlace({ ...newPlace, time: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="일정 제목 (예: 점심, 박물관 관람)"
                                    value={newPlace.title}
                                    onChange={(e) => setNewPlace({ ...newPlace, title: e.target.value })}
                                />
                                <select
                                    value={newPlace.category}
                                    onChange={(e) => setNewPlace({ ...newPlace, category: e.target.value })}
                                >
                                    {Object.keys(CATEGORY_ICONS).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="장소명 (선택)"
                                    value={newPlace.placeName}
                                    onChange={(e) => setNewPlace({ ...newPlace, placeName: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="주소 (선택)"
                                    value={newPlace.address}
                                    onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })}
                                />
                                <div className='add_form_buttons'>
                                    <button type="button" onClick={handleAddPlace}>추가</button>
                                    <button type="button" onClick={() => setShowAddForm(false)}>취소</button>
                                </div>
                            </div>
                        )}

                        {!showAddForm && (
                            <button
                                type="button"
                                className='add_schedule_btn'
                                onClick={() => setShowAddForm(true)}
                            >
                                + {currentDay}일차 일정 추가
                            </button>
                        )}

                        <div className='create_plan_button_wrap'>
                            <button
                                type="button"
                                className='create_plan_button'
                                onClick={() => navigate('/myPlanner')}
                            >
                                완료
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Edit;
