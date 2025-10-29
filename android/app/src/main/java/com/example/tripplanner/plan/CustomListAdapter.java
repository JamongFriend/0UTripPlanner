package com.example.tripplanner.plan;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import androidx.annotation.LayoutRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.example.tripplanner.R;

import java.util.List;

public class CustomListAdapter  extends ArrayAdapter<ListItem> {
    private final int resourceLayout;

    public CustomListAdapter(@NonNull Context context, @LayoutRes int resource, @NonNull List<ListItem> items) {
        super(context, resource, items);
        this.resourceLayout = resource;
    }

    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        View view = convertView;

        if (view == null) {
            LayoutInflater inflater = LayoutInflater.from(getContext());
            view = inflater.inflate(resourceLayout, null);
        }

        ListItem item = getItem(position);

        if (item != null) {
            TextView planTitle = view.findViewById(R.id.planTitle);
            TextView planDate = view.findViewById(R.id.planDate);
            TextView planPlace = view.findViewById(R.id.planPlace);
            TextView userId = view.findViewById(R.id.userId);

            if (planTitle != null) {
                planTitle.setText(item.getTitle());
            }

            if (planDate != null) {
                planDate.setText(item.getDate());
            }

            if (planPlace != null) {
                planPlace.setText(item.getPlace());
            }

            if (userId != null) {
                userId.setText(item.getUserId());
            }
        }

        return view;
    }
}