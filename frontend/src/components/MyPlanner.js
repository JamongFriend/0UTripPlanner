import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/MyPlanner.css'

function MyPlanner() {
     // 상태 정의
     const [plannerList, setPlannerList] = useState([]);

     // 컴포넌트가 마운트될 때 API로부터 데이터 받아오기
     useEffect(() => {
         const fetchPlannerList = async () => {
             try {
                 // 백엔드 API로부터 데이터 받아오기
                 const response = await axios.get('/manager/readList');
                 setPlannerList(response.data);  // 받아온 데이터를 상태에 저장
             } catch (error) {
                 console.error("Error fetching data: ", error);
             }
         };
 
         fetchPlannerList();
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