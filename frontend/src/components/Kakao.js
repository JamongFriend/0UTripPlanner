import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../css/Kakao.css"

function Kakao() {
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
            fetch(`http://localhost:5000/kakao/callback?code=${code}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        setUser(data.user);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, [location]);

    return (
        <div>
        {user ? (
            <div>
            <h1>로그인 성공!</h1>
            <p>환영합니다, {user.nickname}님!</p>
            <img src={user.description} alt="Profile" />
            </div>
        ) : (
            <h1>로그인 정보를 불러오는 중...</h1>
        )}
    </div>
    );
}

export default Kakao;