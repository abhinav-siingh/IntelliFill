package com.intellifill.controller;

import com.intellifill.dto.*;
import com.intellifill.service.ProfileService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * All endpoints here are protected by JwtAuthFilter (see SecurityConfig -
 * anything not explicitly listed as public requires a valid token).
 *
 * @AuthenticationPrincipal Long userId always comes from the token itself,
 * NEVER from the request body or a path variable. This is what guarantees
 * User A can never read or modify User B's profile - there is no way for
 * a request to specify "whose" profile to act on other than via the token.
 */
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // ----- Personal profile -----

    @GetMapping
    public ApiResponse<ProfileDto> getProfile(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(profileService.getProfile(userId));
    }

    @PutMapping
    public ApiResponse<ProfileDto> updateProfile(@AuthenticationPrincipal Long userId, @RequestBody ProfileDto dto) {
        return ApiResponse.success(profileService.updateProfile(userId, dto));
    }

    @DeleteMapping
    public ApiResponse<String> deleteProfile(@AuthenticationPrincipal Long userId) {
        profileService.deleteProfile(userId);
        return ApiResponse.success("Profile deleted");
    }

    // ----- Address -----

    @GetMapping("/address")
    public ApiResponse<AddressDto> getAddress(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(profileService.getAddress(userId));
    }

    @PutMapping("/address")
    public ApiResponse<AddressDto> updateAddress(@AuthenticationPrincipal Long userId, @RequestBody AddressDto dto) {
        return ApiResponse.success(profileService.updateAddress(userId, dto));
    }

    // ----- Education -----

    @GetMapping("/education")
    public ApiResponse<EducationDto> getEducation(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(profileService.getEducation(userId));
    }

    @PutMapping("/education")
    public ApiResponse<EducationDto> updateEducation(@AuthenticationPrincipal Long userId, @RequestBody EducationDto dto) {
        return ApiResponse.success(profileService.updateEducation(userId, dto));
    }

    // ----- Career -----

    @GetMapping("/career")
    public ApiResponse<CareerDto> getCareer(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(profileService.getCareer(userId));
    }

    @PutMapping("/career")
    public ApiResponse<CareerDto> updateCareer(@AuthenticationPrincipal Long userId, @RequestBody CareerDto dto) {
        return ApiResponse.success(profileService.updateCareer(userId, dto));
    }

    // ----- Social -----

    @GetMapping("/social")
    public ApiResponse<SocialDto> getSocial(@AuthenticationPrincipal Long userId) {
        return ApiResponse.success(profileService.getSocial(userId));
    }

    @PutMapping("/social")
    public ApiResponse<SocialDto> updateSocial(@AuthenticationPrincipal Long userId, @RequestBody SocialDto dto) {
        return ApiResponse.success(profileService.updateSocial(userId, dto));
    }

}
