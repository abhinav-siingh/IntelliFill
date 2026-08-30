package com.intellifill.controller;

import com.intellifill.dto.ApiResponse;
import com.intellifill.dto.AuthResponse;
import com.intellifill.dto.LoginRequest;
import com.intellifill.dto.RegisterRequest;
import com.intellifill.dto.UserResponse;
import com.intellifill.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    /**
     * Protected endpoint - JwtAuthFilter puts the userId (from the token)
     * into the SecurityContext as the "principal", which we read here.
     */
    @GetMapping("/me")
    public ApiResponse<UserResponse> me(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(authService.getCurrentUser(userId));
    }

}
