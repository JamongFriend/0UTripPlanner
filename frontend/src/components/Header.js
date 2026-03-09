import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../css/Header.css';

import {FaSearch} from "react-icons/fa";

function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8002/auth/status', { 
        withCredentials: true,
        params: { t: Date.now() } 
      });
      
      // 현재 상태와 서버 응답이 다를 때만 업데이트해서 루프 차단
      if (isLoggedIn !== response.data.isLoggedIn) {
        setIsLoggedIn(response.data.isLoggedIn);
      }
    } catch (err) {
      if (isLoggedIn !== false) setIsLoggedIn(false);
    }
  };

  checkLoginStatus();
  // 💡 location.pathname을 의존성 배열에서 잠시 빼보세요. 루프의 원인일 확률이 높습니다.
  }, [setIsLoggedIn]);

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    try {
      console.log("로그아웃 프로세스 시작...");
      // 로그아웃 요청을 보내고 응답을 받을 때까지 무조건 await
      const response = await axios.post('http://localhost:8002/auth/logout', {}, { withCredentials: true });
      
      if (response.data.success) {
        setIsLoggedIn(false);
        alert('로그아웃 되었습니다.');
        // 서버 처리가 끝난 후 안전하게 이동
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };


  const navItems = [
    { title: '플래너 생성', path: '/Create' },
    { title: '내 플래너', path: '/MyPlanner' },
    { title: '플래너 공유', path: '/Share' },
    { title: '북마크', path: '/Bookmarks' },
    { title: '여행지 추천', path: '/Suggest' },
    { title: '지도', path: '/Map' },
  ];

  return (
    <header>
      <div className="mainHeader">
        <div className='hd_Inner'>
          <div className='hd_Top'>
            <div className='hd_top_left_wrap'>
              {/* 로고 */}
              <div className='hd_LogoLayout'>
              <Link to={"/"}></Link>
              </div>
              {/* 검색창 */}
              <div className='hd_searchLayout'>
                <div className='hd_sc_box'>
                  <input className='input' type="text" placeholder="여행지, 항공권 검색..."/>
                  <div className='hd_sc_button_wrap'>
                    <button className='sc_button'><FaSearch/></button>
                </div>
                </div>
              </div>
            </div>
            {/* 상단 기능 */}
            <div className='hd_func'>
              <div className='hd_f_option'><Link to="/help">고객센터</Link></div>
              <div className='hd_f_option'><Link to="/language">언어</Link></div>
              <div className='hd_f_option'>
                <div className='hd_f_op_user'>
                  {isLoggedIn ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to="/Account">내 정보</Link>
                      <button onClick={handleLogout} className="logout_btn">로그아웃</button>
                    </div>
                  ) : (
                    <Link to="/Login">로그인</Link>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 네비게이션 바 */}
          <div className='headerNavBar'>
            <ul className='headerNavBarInner'>
              {navItems.map((item, index) => (
                <li key={index} className="nav_bar_item">
                  <Link className="nav_bar_lnk" to={item.path}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
