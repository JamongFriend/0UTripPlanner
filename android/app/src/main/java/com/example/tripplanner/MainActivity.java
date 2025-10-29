package com.example.tripplanner;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.MenuItem;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.tripplanner.fragment.BookmarkFragment;
import com.example.tripplanner.fragment.HomeFragment;
import com.example.tripplanner.fragment.MyPlanFragment;
import com.example.tripplanner.fragment.ProfileFragment;
import com.example.tripplanner.fragment.SearchFragment;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {
    //로그인 성공 후 메인 화면
    BottomNavigationView navi;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //네비화면 메인
        navi = findViewById(R.id.bottomNavigationView);
        getSupportFragmentManager().beginTransaction().replace(R.id.mainFrame, new HomeFragment()).commit();

        //네비게이션 바 클릭시 화면 전환
        navi.setOnItemSelectedListener(new BottomNavigationView.OnItemSelectedListener() {
            @SuppressLint("NonConstantResourceId")
            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                int itemId = item.getItemId();
                if (itemId == R.id.homeFragment) {
                    getSupportFragmentManager().beginTransaction().replace(R.id.mainFrame, new HomeFragment()).commit();
                } else if (itemId == R.id.searchFragment) {
                    getSupportFragmentManager().beginTransaction().replace(R.id.mainFrame, new SearchFragment()).commit();
                } else if (itemId == R.id.bookmarkFragment) {
                    getSupportFragmentManager().beginTransaction().replace(R.id.mainFrame, new BookmarkFragment()).commit();
                } else if (itemId == R.id.myPlanFragment) {
                    getSupportFragmentManager().beginTransaction().replace(R.id.mainFrame, new MyPlanFragment()).commit();
                } else if (itemId == R.id.profileFragment) {
                    getSupportFragmentManager().beginTransaction().replace(R.id.mainFrame, new ProfileFragment()).commit();
                }
                return true;
            }
        });
    }
}