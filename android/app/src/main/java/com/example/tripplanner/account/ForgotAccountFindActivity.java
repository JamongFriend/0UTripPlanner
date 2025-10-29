package com.example.tripplanner.account;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.tripplanner.R;

public class ForgotAccountFindActivity extends AppCompatActivity {
    //계정 찾기 기능
    private EditText userName, userBirthYear, userBirthMonth, userBirthDate, userID;
    private Button checkID, checkPW;
    private TextView back;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_forgotaccountfind);

        userName = findViewById(R.id.userName);
        userBirthYear = findViewById(R.id.userBirthYear);
        userBirthMonth = findViewById(R.id.userBirthMonth);
        userBirthDate = findViewById(R.id.userBirthDate);
        userID = findViewById(R.id.userID);

        checkID = findViewById(R.id.checkID);
        checkPW = findViewById(R.id.checkPW);

        //뒤로가기 버튼
        back = findViewById(R.id.back);
        back.setOnClickListener(v -> onBackPressed());

        //아이디 확인 버튼
        checkID.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String name = userName.getText().toString();
                String year = userBirthYear.getText().toString();
                String month = userBirthMonth.getText().toString();
                String date = userBirthDate.getText().toString();

                checkInfo(name);
                checkInfo(year);
                checkInfo(month);
                checkInfo(date);
            }
        });

        //비밀번호 확인 버튼
        checkPW.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String id = userID.getText().toString();

                checkInfo(id);
            }
        });

    }

    // 입력받은 정보와 기존 정보가 일치하는 지 확인
    private void checkInfo(String inputInfo){

    }
}
