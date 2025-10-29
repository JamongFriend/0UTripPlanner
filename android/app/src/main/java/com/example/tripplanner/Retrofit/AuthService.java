package com.example.tripplanner.Retrofit;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;

public interface AuthService {

    // 로그인 요청 (아이디, 비밀번호를 받아서 로그인)
    @POST("/auth/login")
    @FormUrlEncoded
    Call<LoginResponse> login(@Body LoginRequest loginRequest);

    // 카카오 로그인 요청 (카카오 로그인 페이지로 리다이렉트)
    @GET("/auth/kakao")
    Call<Void> kakaoLogin();

    // 카카오 콜백 처리
    @GET("/auth/kakao/callback")
    Call<Void> kakaoCallback(@Query("code") String code);

    @GET("auth/logout")
    Call<Void> logout();
}
