import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import axios from 'axios';
import '../css/Create.css';

function Edit() {
    const location = useLocation();
    const navigate = useNavigate();
    const planData = location.state?.planData;

    const [formData, setFormData] = useState(null);

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
            hotel: planData.hotel || "",
            description: planData.description || ""
        });

        if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map');
                if (container) {
                    const options = {
                        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                        level: 3
                    };
                    new window.kakao.maps.Map(container, options);
                }
            });
        }
    }, [planData, navigate]);

    const handleDateChange = (date, name) => {
        setFormData({ ...formData, [name]: date });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`http://localhost:8002/myPlanner/edit/${formData.id}`, formData, {
                withCredentials: true
            });

            if (res.data.success) {
                alert('여행 계획이 수정되었습니다!');
                navigate('/myPlanner');
            }
        } catch (err) {
            console.error("수정 에러:", err);
            alert('수정에 실패했습니다.');
        }
    };

    if (!formData) return <div>로딩 중...</div>;

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

                        <div className='plan_hotel_wrap'>
                            <div className='content_title'>
                                <div className='plan_hotel_title'>숙박 시설</div>
                            </div>
                            <div className='input_box'>
                                <input type="text" name="hotel" value={formData.hotel} onChange={handleChange} placeholder="숙박 시설을 입력하세요" />
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

                        <div className='create_plan_button_wrap'>
                            <button type="submit" className='create_plan_button'>수정 완료</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Edit;