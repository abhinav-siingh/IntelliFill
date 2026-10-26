package com.intellifill.dto;

import com.intellifill.entity.Career;

public class CareerDto {

    private String skills; // comma-separated, e.g. "Java, Spring Boot, MySQL"
    private String experience;
    private String currentStatus;
    private String preferredRole;
    private String preferredLocation;

    public static CareerDto fromEntity(Career c) {
        CareerDto dto = new CareerDto();
        dto.skills = c.getSkills();
        dto.experience = c.getExperience();
        dto.currentStatus = c.getCurrentStatus();
        dto.preferredRole = c.getPreferredRole();
        dto.preferredLocation = c.getPreferredLocation();
        return dto;
    }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }

    public String getPreferredRole() { return preferredRole; }
    public void setPreferredRole(String preferredRole) { this.preferredRole = preferredRole; }

    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }
}
