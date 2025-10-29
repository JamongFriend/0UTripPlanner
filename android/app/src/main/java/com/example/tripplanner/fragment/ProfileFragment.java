package com.example.tripplanner.fragment;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import com.example.tripplanner.R;
import com.example.tripplanner.Retrofit.APIClient;
import com.example.tripplanner.Retrofit.AuthService;
import com.example.tripplanner.account.LoginActivity;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileFragment extends Fragment {
    private Button logoutButton;
    private AuthService authService;

    @SuppressLint("MissingInflatedId")
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.profile_fragment, container, false);

        authService = APIClient.getClient().create(AuthService.class);
        logoutButton = view.findViewById(R.id.logoutButton);
        logoutButton.setOnClickListener(v-> {
            authService.logout().enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    if(response.isSuccessful()){
                        //로그아웃 성공
                        Intent intent = new Intent(requireActivity(), LoginActivity.class);
                        startActivity(intent);
                        requireActivity().finish();
                    }else {
                        // 로그아웃 실패, 오류 메시지 표시
                        Toast.makeText(requireActivity(), "로그아웃 실패", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    Toast.makeText(requireActivity(), "네트워크 오류", Toast.LENGTH_SHORT).show();
                }
            });
        });


        return view;
    }
}
