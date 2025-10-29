import React, { useState } from 'react';
import axios from 'axios';
import '../css/Create.css';

function Create() {
    // 입력값 상태 관리
    const [formData, setFormData] = useState({
        planName: '',
        personnel: '',
        purpose: '',
        place: '',
        startDate: '',
        endDate: '',
        hotel: '',
        description: '',
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 플래너 생성 API 호출
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('backend/routes/creater/create', formData); // 백엔드 API 호출
        alert('플래너가 성공적으로 생성되었습니다!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error creating plan:', error);
        alert('플래너 생성 중 오류가 발생했습니다.');
    }
    };

  return (
    <div className='createPlan'>
        <div className='create_plan_outLineBox' onSubmit={handleSubmit}>
            <div className='create_plan_content'>
                <div className='content_box'>
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
                            />
                        </div>
                    </div>
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
                                placeholder="여행 인원 수를 입력하세요"
                            />
                        </div>
                    </div>
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
                    <div className='plan_place_wrap'>
                        <div className='content_title'>
                            <div className='plan_place_title'>여행 장소</div>
                        </div>
                        <div className='kakaoMap_wrap'>
                            <div id='map'></div>
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
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
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
                            />  
                        </div>
                    </div>
                    <div className='create_plan_button_wrap'>
                        <button
                            type="submit"
                            className='create_plan_button'>
                                생성
                            </button>
                    </div>
                </div>

            </div>

        </div>

    </div>
  );
}

export default Create;