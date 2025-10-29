package com.example.tripplanner.fragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ListView;

import androidx.fragment.app.Fragment;

import com.example.tripplanner.R;
import com.example.tripplanner.plan.CustomListAdapter;
import com.example.tripplanner.plan.ListItem;

import java.util.ArrayList;
import java.util.List;

public class BookmarkFragment extends Fragment {
    private ListView listView;
    private List<ListItem> bookmarkList;
    private Button deleteButton;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.bookmark_fragment, container, false);

        listView = view.findViewById(R.id.bookmarkListView);
        deleteButton = view.findViewById(R.id.deletePlan);
        bookmarkList = new ArrayList<>();

        bookmarkList.add(new ListItem("Trip to Paris", "2023-12-15", "Eiffel Tower", "User123"));
        bookmarkList.add(new ListItem("Beach Vacation", "2024-01-10", "Miami Beach", "User456"));
        bookmarkList.add(new ListItem("Hiking Adventure", "2024-02-20", "Rocky Mountains", "User789"));

        CustomListAdapter adapter = new CustomListAdapter(requireContext(), R.layout.listitem, bookmarkList);
        listView.setAdapter(adapter);
        deleteButton.setOnClickListener(v-> {
            ArrayList<ListItem> itemsToRemove = new ArrayList<>();
            for (int i = 0; i < listView.getCount(); i++) {
                if (listView.isItemChecked(i)) {
                    itemsToRemove.add(bookmarkList.get(i));
                }
            }
            bookmarkList.removeAll(itemsToRemove);
            listView.clearChoices();
            adapter.notifyDataSetChanged();
        });

        return view;
    }
}
