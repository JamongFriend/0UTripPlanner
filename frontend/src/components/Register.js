import React, { useState, useEffect } from 'react';
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
    const navigate = useNavigate();
    const [idError, setIdError] = useState('');
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [phoneMessage, setPhoneMessage] = useState('');

    useEffect(() => {
        const { id, password, checkPassword, name, phone, checkPhone } = formData;
            
        const isValid = 
            id.trim() && 
            password.trim() && 
            checkPassword.trim() && 
            password === checkPassword &&
            name.trim() && 
            phone.trim() && 
            checkPhone.trim() && 
            isIdChecked &&  
            isPhoneVerified &&
            !idError.includes('불가능') && 
            !idError.includes('이상');

        setNotAllow(!isValid);
    }, [formData, idError, isIdChecked, isPhoneVerified]);

    // 아이디 형식 유효성 검사
    const validateId = (id) => {
        if (id.length < 3) return '아이디는 3자 이상이어야 합니다.';
        const regex = /^[a-zA-Z0-9]+$/;
        if (!regex.test(id)) return '아이디는 영문과 숫자만 포함할 수 있습니다.';
        return '';
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

   const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'id') {
            setIdError(validateId(value));
            setIsIdChecked(false); // 아이디가 바뀌면 다시 중복확인 필요
        }
    };

    // 2. 아이디 중복 확인 함수
    const checkIdAvailability = async () => {
        if (!formData.id || validateId(formData.id)) {
            alert('유효한 아이디를 입력해주세요.');
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8002/auth/check-id/${formData.id}`);
            
            if (response.data.success) {
                alert('사용 가능한 아이디입니다.');
                setIdError('사용 가능한 아이디입니다.');
                setIsIdChecked(true);
            }
        } catch (error) {
            setIdError('이미 등록된 사용자 아이디입니다.');
            setIsIdChecked(false);
            alert('이미 사용 중인 아이디입니다.');
        } finally {
            setLoading(false);
        }
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.checkPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8002/auth/register', formData);
            if (response.data.success) {
                alert('회원가입 성공! 로그인 해주세요.');
                navigate('/Login');
            }
        } catch (err) {
            setError('회원가입 실패. 입력 정보를 확인해주세요.');
        }
    };

    // 2. 인증번호 발송 요청
    const handleSendCode = async () => {
        if (!formData.phone) return alert("전화번호를 입력하세요.");
        try {
            const res = await axios.post('http://localhost:8002/auth/send-code', { 
                phone: formData.phone 
            });
            if (res.data.success) alert("인증번호가 발송되었습니다.");
        } catch (err) {
            alert("발송 실패");
        }
    };

    const handleVerifyCode = async () => {
    try {
        const res = await axios.post('http://localhost:8002/auth/verify-code', { 
            checkPhone: formData.checkPhone 
        }, { withCredentials: true });
        
        if (res.data.success) {
            setIsPhoneVerified(true);
            setPhoneMessage("인증 성공!");
            alert("전화번호 인증 완료");
        }
    } catch (err) {
        setPhoneMessage("인증번호가 일치하지 않습니다.");
        setIsPhoneVerified(false);
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
                            {/* 아이디 섹션 */}
                            <div className='id_wrap'>
                                <div className='content_title'>아이디</div>
                                <div className='content_wrap' style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <div className='input_box' style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            name="id"
                                            value={formData.id}
                                            onChange={handleChange}
                                            placeholder="아이디를 입력하세요"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className='check_id_button'
                                        onClick={checkIdAvailability}
                                        style={{ height: '48px', padding: '0 15px', borderRadius: '8px', cursor: 'pointer' }}
                                    >
                                        {loading ? '확인중...' : '중복확인'}
                                    </button>
                                </div>
                                {idError && (
                                    <p style={{ 
                                        fontSize: '13px', 
                                        marginLeft: '5px',
                                        marginTop: '-10px',
                                        marginBottom: '15px',
                                        // 사용 가능하면 초록색(또는 파란색), 아니면 빨간색
                                        color: isIdChecked ? '#2ecc71' : '#e74c3c',
                                        fontWeight: '600'
                                    }}>
                                        {idError}
                                    </p>
                                )}
                            </div>
                            {/* 이메일 */}
                            <div className='email_wrap'>
                                <div className='content_title'>이메일</div>
                                <div className='input_box'>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일을 입력하세요" />
                                </div>
                            </div>

                            {/* 비밀번호 */}
                            <div className='password_wrap'>
                                <div className='content_title'>비밀번호</div>
                                <div className='input_box'>
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력하세요" />
                                </div>
                            </div>

                            {/* 비밀번호 확인 */}
                            <div className='check_password_wrap'>
                                <div className='content_title'>비밀번호 확인</div>
                                <div className='input_box'>
                                    <input type="password" name="checkPassword" value={formData.checkPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력하세요" />
                                </div>
                            </div>

                            {/* 이름 */}
                            <div className='name_wrap'>
                                <div className='content_title'>이름</div>
                                <div className='input_box'>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력하세요" />
                                </div>
                            </div>

                            {/* 전화번호 입력 섹션 (인증요청 버튼 포함) */}
                            <div className='phone_wrap'>
                                <div className='content_title'>전화번호</div>
                                <div className='content_wrap' style={{ display: 'flex', gap: '10px' }}>
                                    <div className='input_box' style={{ flex: 1 }}>
                                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="전화번호를 입력하세요" disabled={isPhoneVerified} />
                                    </div>
                                    <button type="button" onClick={handleSendCode} className='check_phone_button' disabled={isPhoneVerified}>인증요청</button>
                                </div>
                            </div>

                            {/* 인증번호 확인 섹션 */}
                            <div className='check_phone_wrap'>
                                <div className='content_title'>인증번호</div>
                                <div className='content_wrap' style={{ display: 'flex', gap: '10px' }}>
                                    <div className='input_box' style={{ flex: 1 }}>
                                        <input type="text" name="checkPhone" value={formData.checkPhone} onChange={handleChange} placeholder="인증번호를 입력하세요" disabled={isPhoneVerified} />
                                    </div>
                                    <button type="button" onClick={handleVerifyCode} className='check_id_button' disabled={isPhoneVerified}>확인</button>
                                </div>
                                {phoneMessage && <p style={{ color: isPhoneVerified ? 'green' : 'red', fontSize: '12px' }}>{phoneMessage}</p>}
                            </div>

                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                            <div className='register_button_wrap'>
                                <button type="submit" className='register_button' disabled={notAllow}>
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
