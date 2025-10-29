package com.example.tripplanner.plan;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.tripplanner.R;
import com.example.tripplanner.fragment.MyPlanFragment;

import java.util.Calendar;

public class CreatePlan extends AppCompatActivity {
    private EditText planTilteEdit, placeEdit, hotelEdit;
    private TextView selectedStartDateEdit, selectedEndDateEdit, back;
    private Button startDateButton, endDateButton, finishButton;

    @Override
    protected void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_plan);

        planTilteEdit = findViewById(R.id.planTilteEdit);
        placeEdit = findViewById(R.id.placeEdit);
        hotelEdit = findViewById(R.id.hotelEdit);

        selectedStartDateEdit = findViewById(R.id.selectedStartDateEdit);
        selectedEndDateEdit = findViewById(R.id.selectedEndDateEdit);
        startDateButton = findViewById(R.id.startDateButton);
        endDateButton = findViewById(R.id.endDateButton);

        finishButton = findViewById(R.id.finishButton);

        back = findViewById(R.id.back);
        back.setOnClickListener(v -> onBackPressed());

        startDateButton.setOnClickListener(v-> showDatePickerDialog(selectedStartDateEdit));
        endDateButton.setOnClickListener(v-> showDatePickerDialog(selectedEndDateEdit));
        finishButton.setOnClickListener(v-> {
            getSupportFragmentManager().beginTransaction().replace(R.id.mainFrame, new MyPlanFragment()).addToBackStack(null).commit();
        });
    }

    private void showDatePickerDialog(TextView targetTextView) {
        Calendar calendar = Calendar.getInstance();
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH);
        int dayOfMonth = calendar.get(Calendar.DAY_OF_MONTH);

        DatePickerDialog datePickerDialog = new DatePickerDialog(this,
                (datePicker, selectedYear, selectedMonth, selectedDayOfMonth) -> {
                        String selectedDate = selectedYear + "_" + (selectedMonth + 1) + "_" + selectedDayOfMonth;
                        targetTextView.setText(selectedDate);
                }, year, month, dayOfMonth
        );
        datePickerDialog.show();
    }
}

