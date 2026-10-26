package com.intellifill.dto;

import com.intellifill.entity.Address;

public class AddressDto {

    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;

    public static AddressDto fromEntity(Address a) {
        AddressDto dto = new AddressDto();
        dto.address = a.getAddress();
        dto.city = a.getCity();
        dto.state = a.getState();
        dto.country = a.getCountry();
        dto.pincode = a.getPincode();
        return dto;
    }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}
