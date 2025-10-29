import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';

import {FaSearch} from "react-icons/fa";

function Header() {
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
                  <input 
                    className='input'
                    type="text"
                    placeholder="여행지, 항공권 검색..."
                  />
                  <div className='hd_sc_button_wrap'>
                  <button className='sc_button'>
                    <FaSearch/>
                  </button>
                </div>
                </div>
              </div>
            </div>
            {/* 상단 기능 */}
            <div className='hd_func'>
              <div className='hd_f_option'>
                <div className='hd_f_op_help'>
                  <Link to="/help">고객센터</Link>
                </div>
              </div>
              <div className='hd_f_option'>
                <div className='hd_f_dop_lg_icon'>
                  <Link to="/language">언어</Link>
                </div>
              </div>
              <div className='hd_f_option'>
                <div className='hd_f_op_user'>
                  <Link to="/Account">사용자</Link>
                </div>
              </div>
            </div>
          </div>

          {/* 네비게이션 바 */}
          <div className='headerNavBar'>
            <ul className='headerNavBarInner'>
              {navItems.map((item, index) => (
                <li key={index} className="nav_bar_item">
                  <Link className="nav_bar_lnk" to={item.path}>
                    {item.title}
                  </Link>
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
