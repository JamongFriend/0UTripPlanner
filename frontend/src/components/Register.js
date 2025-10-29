import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Register.css';

function Register() {
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        password: '',
        checkPassword: '',
        name: '',
        phone: '',
        checkPhone: '',
    });
    const [error, setError] = useState('');
    const [notAllow, setNotAllow] = useState(true);
    const history = useNavigate();
    const [idError, setIdError] = useState('');
    const [loading, setLoading] = useState(false);

    // 아이디 형식 유효성 검사 (프론트엔드)
    const validateId = (id) => {
        if (id.length < 3) return '아이디는 3자 이상이어야 합니다.';
        const regex = /^[a-zA-Z0-9]+$/;
        if (!regex.test(id)) return '아이디는 영문과 숫자만 포함할 수 있습니다.';
        return '';  // 유효하면 빈 문자열
    };

    // 아이디 변경 시 처리
    const handleIdChange = (event) => {
        const newId = event.target.value;
        setFormData((prevState) => ({
            ...prevState,
            id: newId,
        }));

        // 형식 검사
        const errorMessage = validateId(newId);
        setIdError(errorMessage);
    };

    // 아이디 중복 확인 함수
    const checkIdAvailability = async (id) => {
        setLoading(true);
        try {
            const response = await axios.get(`/manager/check-id/${id}`);
            if (response.status === 200) {
                setIdError('사용 가능한 아이디입니다.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setIdError('이미 등록된 사용자 아이디입니다.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // 입력값이 모두 채워졌는지 확인
        if (
            formData.id.trim() &&
            formData.password.trim() &&
            formData.checkPassword.trim() &&
            formData.name.trim() &&
            formData.checkPhone.trim() &&
            !idError
        ) {
            setNotAllow(false);
        } else {
            setNotAllow(true);
        }
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.checkPassword) {
            setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('/backend/routes/user/', formData);
            
            if (response.data.success) {
                history.push('/dashboard');
            }
        } catch (err) {
            setError('회원가입 실패. 다시 시도해 주세요.');
        }
    };

    return (
        <div className='register_wrap'>
            <div className='register_outLineBox'>
                <div className='register_title'>
                    회원가입
                </div>
                <div className='register_content'>
                    <div className='content_box'>
                        <form onSubmit={handleSubmit}>
                            <div className='id_wrap'>
                                <div className='content_title'>
                                    <div className='id_title'>아이디</div>
                                </div>
                                <div className='content_wrap'>
                                    <div className='input_box'>
                                        <input
                                            type="text"
                                            name="id"
                                            value={formData.id}
                                            onChange={handleIdChange}
                                            placeholder="아이디를 입력하세요"
                                        />
                                        {loading && <p>로딩 중...</p>}
                                        {idError && <p className="error">{idError}</p>}
                                    </div>
                                    <button
                                        type="button"
                                        className='check_id_button'
                                        onClick={checkIdAvailability}
                                    >
                                        아이디 확인
                                    </button>
                                </div>
                            </div>
                            <div className='email_wrap'>
                                <div className='content_title'>
                                    <div className='email_title'>이메일</div>
                                </div>
                                <div className='input_box'>
                                    <input
                                        type="text"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="이메일을 입력하세요"
                                    />
                                </div>
                            </div>

                            <div className='password_wrap'>
                                <div className='content_title'>
                                    <div className='password_title'>비밀번호</div>
                                </div>
                                <div className='input_box'>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="비밀번호를 입력하세요"
                                    />
                                </div>
                            </div>

                            <div className='check_password_wrap'>
                                <div className='content_title'>
                                    <div className='check_password_title'>비밀번호 확인</div>
                                </div>
                                <div className='input_box'>
                                    <input
                                        type="password"
                                        name="checkPassword"
                                        value={formData.checkPassword}
                                        onChange={handleChange}
                                        placeholder="비밀번호를 확인하세요"
                                    />
                                </div>
                            </div>

                            <div className='name_wrap'>
                                <div className='content_title'>
                                    <div className='name_title'>이름</div>
                                </div>
                                <div className='input_box'>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="이름을 입력하세요"
                                    />
                                </div>
                            </div>

                            <div className='phone_wrap'>
                                <div className='content_title'>
                                    <div className='phone_title'>전화번호</div>
                                </div>
                                <div className='content_wrap'>
                                    <div className='input_box'>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="전화번호를 입력하세요"
                                        />
                                    </div>
                                    <button className='check_phone_button'>
                                        인증번호
                                    </button>
                                </div>
                            </div>

                            <div className='check_phone_wrap'>
                                <div className='content_title'>
                                    <div className='check_phone_title'>전화번호 인증</div>
                                </div>
                                <div className='input_box'>
                                    <input
                                        type="text"
                                        name="checkPhone"
                                        value={formData.checkPhone}
                                        onChange={handleChange}
                                        placeholder="인증번호를 입력하세요"
                                    />
                                </div>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <div className='register_button_wrap'>
                                <button
                                    type="submit"
                                    className='register_button'
                                    disabled={notAllow}
                                >
                                    회원가입
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
