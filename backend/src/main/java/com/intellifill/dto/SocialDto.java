package com.intellifill.dto;

import com.intellifill.entity.SocialProfile;

public class SocialDto {

    private String linkedin;
    private String github;
    private String portfolio;

    public static SocialDto fromEntity(SocialProfile s) {
        SocialDto dto = new SocialDto();
        dto.linkedin = s.getLinkedin();
        dto.github = s.getGithub();
        dto.portfolio = s.getPortfolio();
        return dto;
    }

    public String getLinkedin() { return linkedin; }
    public void setLinkedin(String linkedin) { this.linkedin = linkedin; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }

    public String getPortfolio() { return portfolio; }
    public void setPortfolio(String portfolio) { this.portfolio = portfolio; }
}
