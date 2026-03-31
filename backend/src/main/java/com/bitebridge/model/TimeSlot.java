package com.bitebridge.model;

public class TimeSlot {
    private String openTime;
    private String closeTime;
    private boolean isClosed;

    public TimeSlot() {
    }

    public TimeSlot(String openTime, String closeTime, boolean isClosed) {
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.isClosed = isClosed;
    }

    public String getOpenTime() {
        return openTime;
    }

    public void setOpenTime(String openTime) {
        this.openTime = openTime;
    }

    public String getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(String closeTime) {
        this.closeTime = closeTime;
    }

    public boolean isClosed() {
        return isClosed;
    }

    public void setClosed(boolean closed) {
        isClosed = closed;
    }
}
