package com.intellifill.dto;

import com.intellifill.entity.Profile;

/**
 * Used for both incoming PUT requests and outgoing GET responses.
 * All fields optional - a partial update only touches the fields
 * the client actually sends (see ProfileService for the merge logic).
 */
public class ProfileDto {

    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String phone;
    private String gender;
    private String dateOfBirth;
    private String fatherName;
    private String motherName;
    private String category;
    private String religion;
    private String pwd;
    private String nationality;
    private String citizenship;
    private String maritalStatus;

    public static ProfileDto fromEntity(Profile p) {
        ProfileDto dto = new ProfileDto();
        dto.firstName = p.getFirstName();
        dto.lastName = p.getLastName();
        dto.fullName = p.getFullName();
        dto.email = p.getEmail();
        dto.phone = p.getPhone();
        dto.gender = p.getGender();
        dto.dateOfBirth = p.getDateOfBirth();
        dto.fatherName = p.getFatherName();
        dto.motherName = p.getMotherName();
        dto.category = p.getCategory();
        dto.religion = p.getReligion();
        dto.pwd = p.getPwd();
        dto.nationality = p.getNationality();
        dto.citizenship = p.getCitizenship();
        dto.maritalStatus = p.getMaritalStatus();
        return dto;
    }

    // ----- Getters and setters -----

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }

    public String getPwd() { return pwd; }
    public void setPwd(String pwd) { this.pwd = pwd; }

    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }

    public String getCitizenship() { return citizenship; }
    public void setCitizenship(String citizenship) { this.citizenship = citizenship; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }
}
