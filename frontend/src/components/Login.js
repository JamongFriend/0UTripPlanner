import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Login.css';

function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();
    const [notAllow, setNotAllow] = useState(true);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {
        // 로그인 요청 보내기
        const response = await axios.post('/login', { id, password });
        
        if (response.data.success) {
          // 로그인 성공 시 리다이렉트
          history.push('/dashboard');
        }
      } catch (err) {
        setError('Login failed. Please check your credentials.');
      }
    };

    const handleInputChange = () => {
        if(id.trim() && password.trim()) {
            setNotAllow(false);
        }
        else {
            setNotAllow(true);
        }
    }
    

    return (
        <div>
            <div className='signAndRegister'>
                <div className='signAndRegister_outLineBox'>
                    <div className='login_register_topTitle'>로그인 / 회원가입</div>
                    <div className='signAndRegister_content'>
                        <div className='contentBox'>
                            <form onSubmit={handleSubmit}>
                                <div className='local_login_wrap'>
                                    <div className='input_warp'>
                                        <div className='input_title'>아이디</div>
                                        <div className='input_box'>
                                            <input
                                                className='input'
                                                type="id"
                                                value={id}
                                                onChange={(e) => {
                                                    setId(e.target.value);
                                                    handleInputChange();
                                                }}
                                                required
                                                placeholder="아이디를 입력하세요"
                                            />
                                        </div>
                                        <div className='input_title'>비밀번호</div>
                                        <div className='input_box'>
                                            <input
                                                className='input'
                                                type="password"
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    handleInputChange();
                                                }}
                                                required
                                                placeholder="비밀번호를 입력하세요"
                                            />
                                        </div>
                                    </div>
                                    {error && <p>{error}</p>}
                                    <div className='login_button_wrap'>
                                        <button 
                                            type="submit"
                                            disabled={notAllow}
                                            className='login_button'>
                                                로그인
                                        </button>
                                    </div>
                                </div>
                                <div className='kakao_login_wrap'>
                                    <div className='icon_wrap'></div>

                                </div>
                                <hr nonshade/>
                                <div className='register_box'>
                                    <div className='goto_register_title'>
                                        계정이 없으신가요?
                                        <div className='goto_register'>
                                            <Link to={"/Register"}>가입하기</Link>
                                        </div>
                                    </div>
                                </div>
                                <hr nonshade/>
                                <div className='kakao_login_wrap'>
                                    <Link to={"/Kakao"}>카카오 로그인</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;