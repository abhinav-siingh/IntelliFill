package com.intellifill.dto;

/**
 * Returned by /api/auth/register and /api/auth/login.
 * Never include passwordHash here - only safe, public user info + token.
 */
public class AuthResponse {

    private String token;
    private UserResponse user;

    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public UserResponse getUser() {
        return user;
    }
}
