import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import '../css/Create.css';

function Create() {
    const [formData, setFormData] = useState({
    planName: '', 
    startDate: new Date(), 
    endDate: new Date(),
    personnel: 1,  
    purpose: '',  
    place: '',
    hotel: '',
    description: ''
    });
    const [isShared, setIsShared] = useState(false);

    useEffect(() => {
        window.kakao.maps.load(() => {
            const container = document.getElementById('map');
            const options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3
            };
            const map = new window.kakao.maps.Map(container, options);
            map.relayout();
        });
    }, []);

    const handleDateChange = (date, name) => {
        setFormData({
            ...formData,
            [name]: date
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const postData = { ...formData, isShared };

            const res = await axios.post('http://localhost:8002/myPlanner/create', formData, {
                withCredentials: true
            });

            if (res.data.success) {
                const message = isShared 
                    ? '여행 계획이 생성 및 공유되었습니다!' 
                    : '여행 계획이 생성되었습니다!';
                alert(message);
                window.location.href = '/myPlanner';
            }
        } catch (err) {
            console.error("생성 에러:", err);
            alert('생성에 실패했습니다. 다시 시도해주세요.');
        }
    };

  return (
    <div className='createPlan'>
            <form className='create_plan_outLineBox' onSubmit={handleSubmit}>
                <div className='create_plan_content'>
                    <div className='content_box'>
                        {/* ... 기존 입력 필드들 (planName, personnel 등) ... */}
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

                        {/* 💡 공유 여부 체크박스 추가 */}
                        <div className='share_check_wrap'>
                            <label className='share_checkbox_label'>
                                <input 
                                    type="checkbox" 
                                    className='share_checkbox'
                                    checked={isShared}
                                    onChange={(e) => setIsShared(e.target.checked)}
                                />
                                <span>이 플래너를 다른 사람들과 공유하기</span>
                            </label>
                        </div>

                        {/* 생성 버튼 */}
                        <div className='create_plan_button_wrap'>
                            <button type="submit" className='create_plan_button'>
                                생성
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Create;