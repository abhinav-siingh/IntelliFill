package com.intellifill.dto;

import com.intellifill.entity.Education;

public class EducationDto {

    private String school;
    private String college;
    private String university;
    private String board;
    private String degree;
    private String course;
    private String stream;
    private String passingYear;
    private String percentage;
    private String grade;

    public static EducationDto fromEntity(Education e) {
        EducationDto dto = new EducationDto();
        dto.school = e.getSchool();
        dto.college = e.getCollege();
        dto.university = e.getUniversity();
        dto.board = e.getBoard();
        dto.degree = e.getDegree();
        dto.course = e.getCourse();
        dto.stream = e.getStream();
        dto.passingYear = e.getPassingYear();
        dto.percentage = e.getPercentage();
        dto.grade = e.getGrade();
        return dto;
    }

    public String getSchool() { return school; }
    public void setSchool(String school) { this.school = school; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public String getBoard() { return board; }
    public void setBoard(String board) { this.board = board; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getStream() { return stream; }
    public void setStream(String stream) { this.stream = stream; }

    public String getPassingYear() { return passingYear; }
    public void setPassingYear(String passingYear) { this.passingYear = passingYear; }

    public String getPercentage() { return percentage; }
    public void setPercentage(String percentage) { this.percentage = percentage; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
}
