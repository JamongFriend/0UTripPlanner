package com.example.tripplanner.plan;

public class ListItem {
    private final String title;
    private final String date;
    private final String place;
    private final String userId;

    public ListItem(String title, String date, String place, String userId) {
        this.title = title;
        this.date = date;
        this.place = place;
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public String getDate() {
        return date;
    }

    public String getPlace() {
        return place;
    }

    public String getUserId() {
        return userId;
    }
}
