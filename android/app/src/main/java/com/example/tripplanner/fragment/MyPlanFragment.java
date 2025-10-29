package com.example.tripplanner.fragment;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ListView;

import androidx.fragment.app.Fragment;

import com.example.tripplanner.R;
import com.example.tripplanner.plan.CreatePlan;
import com.example.tripplanner.plan.CustomListAdapter;
import com.example.tripplanner.plan.ListItem;

import java.util.ArrayList;
import java.util.List;

public class MyPlanFragment extends Fragment {
    private ListView listView;
    private List<ListItem> myPlanList;
    private Button deleteButton;
    private Button createButton;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.myplan_fragment, container, false);

        listView = view.findViewById(R.id.myPlanListView);
        deleteButton = view.findViewById(R.id.deletePlan);
        createButton = view.findViewById(R.id.createPlan);

        myPlanList = new ArrayList<>();

        myPlanList.add(new ListItem("Trip to Paris", "2023-12-15", "Eiffel Tower", "User123"));
        myPlanList.add(new ListItem("Beach Vacation", "2024-01-10", "Miami Beach", "User456"));
        myPlanList.add(new ListItem("Hiking Adventure", "2024-02-20", "Rocky Mountains", "User789"));

        CustomListAdapter adapter = new CustomListAdapter(requireContext(), R.layout.listitem, myPlanList);
        listView.setAdapter(adapter);
        deleteButton.setOnClickListener(v-> {
            ArrayList<ListItem> itemsToRemove = new ArrayList<>();
            for (int i = 0; i < listView.getCount(); i++) {
                if (listView.isItemChecked(i)) {
                    itemsToRemove.add(myPlanList.get(i));
                }
            }
            myPlanList.removeAll(itemsToRemove);
            listView.clearChoices();
            adapter.notifyDataSetChanged();
        });
        createButton.setOnClickListener(v-> {
            Intent intent = new Intent(requireActivity(), CreatePlan.class);
            startActivity(intent);
        });

        return view;
    }
}
