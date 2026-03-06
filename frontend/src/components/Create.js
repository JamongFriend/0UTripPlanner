import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Create.css';

function Create() {
    const [formData, setFormData] = useState({
    planName: '', 
    startDate: '',  
    endDate: '',
    personnel: 1,  
    purpose: '',  
    place: '',
    hotel: '',
    description: ''
    });

    useEffect(() => {
        const container = document.getElementById('map');
        const options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3
        };
        const map = new window.kakao.maps.Map(container, options);
        
        map.relayout();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8002/myPlanner/create', formData, {
                withCredentials: true
            });

            if (res.data.success) {
                alert('여행 계획이 생성되었습니다!');
                window.location.href = '/myPlanner';
            }
        } catch (err) {
            console.error("생성 에러:", err);
            alert('생성에 실패했습니다. 다시 시도해주세요.');
        }
    };

  return (
    <div className='createPlan'>
            {/* 2. div를 form으로 변경하여 onSubmit이 작동하게 함 */}
            <form className='create_plan_outLineBox' onSubmit={handleSubmit}>
                <div className='create_plan_content'>
                    <div className='content_box'>
                        {/* 플래너 이름 */}
                        <div className='plan_name_wrap'>
                            <div className='content_title'>
                                <div className='plan_name_title'>플래너 이름</div>
                            </div>
                            <div className='input_box'>
                                <input
                                    type="text"
                                    name="planName"
                                    value={formData.planName}
                                    onChange={handleChange}
                                    placeholder="플래너 이름을 입력하세요"
                                    required
                                />
                            </div>
                        </div>

                        {/* 여행 인원 수 */}
                        <div className='plan_personnel_wrap'>
                            <div className='content_title'>
                                <div className='plan_personnel_title'>여행 인원 수</div>
                            </div>
                            <div className='input_box'>
                                <input
                                    type="number"
                                    name="personnel"
                                    value={formData.personnel}
                                    onChange={handleChange}
                                    min="1"
                                />
                            </div>
                        </div>

                        {/* 여행 목적 */}
                        <div className='plan_purpose_wrap'>
                            <div className='content_title'>
                                <div className='plan_purpose_title'>여행 목적</div>
                            </div>
                            <div className='input_box'>
                                <input
                                    type="text"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    placeholder="여행 목적을 입력하세요"
                                />
                            </div>
                        </div>

                        {/* 여행 장소 및 지도 */}
                        <div className='plan_place_wrap'>
                            <div className='content_title'>
                                <div className='plan_place_title'>여행 장소</div>
                            </div>
                            <div className='kakaoMap_wrap'>
                                {/* 지도가 그려질 영역 */}
                                <div id='map' style={{ width: '100%', height: '300px', backgroundColor: '#eee' }}></div>
                            </div>
                            <div className='input_box'>
                                <input
                                    type="text"
                                    name="place"
                                    value={formData.place}
                                    onChange={handleChange}
                                    placeholder="여행 장소를 입력하세요"
                                />
                            </div>
                        </div>

                        {/* 여행 기간 */}
                        <div className='plan_date_wrap'>
                            <div className='content_title'>
                                <div className='plan_date_title'>여행 기간</div>
                            </div>
                            <div className='input_box'>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                                <span style={{ margin: '0 10px' }}>~</span>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* 숙박 시설 */}
                        <div className='plan_hotel_wrap'>
                            <div className='content_title'>
                                <div className='plan_hotel_title'>숙박 시설</div>
                            </div>
                            <div className='input_box'>
                                <input
                                    type="text"
                                    name="hotel"
                                    value={formData.hotel}
                                    onChange={handleChange}
                                    placeholder="숙박 시설을 입력하세요"
                                />
                            </div>
                        </div>

                        {/* 플래너 설명 */}
                        <div className='plan_description_wrap'>
                            <div className='content_title'>
                                <div className='plan_description_title'>플래너 설명</div>
                            </div>
                            <div className='input_description_box'>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="플래너 설명을 입력하세요"
                                    style={{ width: '100%', height: '100px' }}
                                />  
                            </div>
                        </div>

                        {/* 생성 버튼 */}
                        <div className='create_plan_button_wrap'>
                            <button
                                type="submit"
                                className='create_plan_button'>
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