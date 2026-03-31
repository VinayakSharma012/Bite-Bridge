package com.bitebridge.model;

public class Address {
    private String id;
    private String label;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private double latitude;
    private double longitude;
    private boolean isDefault;

    public Address() {
    }

    public Address(String id, String label, String street, String city, String state,
                   String pincode, double latitude, double longitude, boolean isDefault) {
        this.id = id;
        this.label = label;
        this.street = street;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.isDefault = isDefault;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean aDefault) { isDefault = aDefault; }
}
