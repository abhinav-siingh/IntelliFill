package com.intellifill.service;

import com.intellifill.dto.AuthResponse;
import com.intellifill.dto.LoginRequest;
import com.intellifill.dto.RegisterRequest;
import com.intellifill.dto.UserResponse;
import com.intellifill.entity.User;
import com.intellifill.exception.DuplicateEmailException;
import com.intellifill.exception.InvalidCredentialsException;
import com.intellifill.repository.UserRepository;
import com.intellifill.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("An account with this email already exists");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        // Never store the raw password - only the BCrypt hash
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.getId());
        return new AuthResponse(token, UserResponse.fromEntity(saved));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token, UserResponse.fromEntity(user));
    }

    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        return UserResponse.fromEntity(user);
    }

}
