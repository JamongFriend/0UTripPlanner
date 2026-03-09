import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/MyPlanner.css'

function MyPlanner() {
    const [plans, setPlans] = useState([]);
    const plannerList = plans;

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
                                                    <span className='value'>{plan.date}</span>
                                                </div>
                                                <div className='info_row'>
                                                    <span className='label'>📍 장소:</span>
                                                    <span className='value'>{plan.place}</span>
                                                </div>
                                            </div>
                                            <div className='planner_footer'>
                                                <button className='detail_btn'>상세 보기</button>
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
        </div>
    )
}

export default MyPlanner;