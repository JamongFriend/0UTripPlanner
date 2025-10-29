package com.example.tripplanner.account;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.tripplanner.MainActivity;
import com.example.tripplanner.R;
import com.example.tripplanner.Retrofit.APIClient;
import com.example.tripplanner.Retrofit.AuthService;
import com.example.tripplanner.Retrofit.LoginRequest;
import com.example.tripplanner.Retrofit.LoginResponse;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {
    //로그인 기능
    private EditText idEditText, passwordEditText;
    private Button loginButton;
    private TextView forgotText, registerText, kakaoLoginButton;
    private AuthService authService;

    String id, pw;

    @SuppressLint("MissingInflatedId")
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        idEditText = findViewById(R.id.idEditText);
        passwordEditText = findViewById(R.id.passwordEditText);
        loginButton = findViewById(R.id.loginButton);
        forgotText = findViewById(R.id.forgotText);
        registerText = findViewById(R.id.registerText);
        kakaoLoginButton = findViewById(R.id.kakaoLoginText);

        authService = APIClient.getClient().create(AuthService.class);
        //로그인 버튼
        loginButton.setOnClickListener(v -> {
            String id = idEditText.getText().toString().trim();
            String password = passwordEditText.getText().toString().trim();
            //유효성 검사
            if (id.isEmpty() || password.isEmpty()) {
                Toast.makeText(LoginActivity.this, "아이디와 비밀번호를 입력하세요.", Toast.LENGTH_SHORT).show();
                return;
            }
            // 일반 로그인
            login(id, password);
            //카카오 로그인
            kakaoLogin(id, password);
        });

        //아이디, 비번 찾기 페이지로 이동
        forgotText.setOnClickListener(v -> {
            Intent intent = new Intent(this, ForgotAccountFindActivity.class);
            startActivity(intent);
        });
        //회원가입 페이지로 이동
        registerText.setOnClickListener(v -> {
            Intent intent = new Intent(this, RegisterAccountActivity.class);
            startActivity(intent);
        });
    }
    private void login(String id, String password) {
        LoginRequest loginRequest = new LoginRequest(id, password);
        authService.login(loginRequest).enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                if(response.isSuccessful()){
                    Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                    startActivity(intent);
                }else {
                    // 로그인 실패, 오류 메시지 표시
                    Toast.makeText(LoginActivity.this, "로그인 실패", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                // 네트워크 오류 등 처리
                Toast.makeText(LoginActivity.this, "네트워크 오류", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void kakaoLogin(String id, String password){
        authService.kakaoLogin().enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                if (response.isSuccessful()) {
                    // 카카오 로그인 성공 시
                    Toast.makeText(LoginActivity.this, "카카오 로그인 페이지로 이동합니다.", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(LoginActivity.this, "카카오 로그인 실패", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {
                Toast.makeText(LoginActivity.this, "네트워크 오류", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
