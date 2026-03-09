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
                                {plannerList.length > 0 ? (
                                    plannerList.map((plan, index) => (
                                        <div key={index} className='planner_item'>
                                            <div className='planner_name'>{plan.name}</div>
                                            <div className='planner_date'>{plan.date}</div>
                                            <div className='planner_place'>{plan.place}</div>
                                            {/* 필요에 따라 다른 정보도 출력 가능 */}
                                        </div>
                                    ))
                                ) : (
                                    <p>플래너 목록이 없습니다.</p>
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