package com.intellifill.service;

import com.intellifill.dto.*;
import com.intellifill.entity.*;
import com.intellifill.repository.*;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final AddressRepository addressRepository;
    private final EducationRepository educationRepository;
    private final CareerRepository careerRepository;
    private final SocialProfileRepository socialProfileRepository;

    public ProfileService(
            ProfileRepository profileRepository,
            AddressRepository addressRepository,
            EducationRepository educationRepository,
            CareerRepository careerRepository,
            SocialProfileRepository socialProfileRepository
    ) {
        this.profileRepository = profileRepository;
        this.addressRepository = addressRepository;
        this.educationRepository = educationRepository;
        this.careerRepository = careerRepository;
        this.socialProfileRepository = socialProfileRepository;
    }

    // ================= PERSONAL PROFILE =================

    public ProfileDto getProfile(Long userId) {
        Profile profile = profileRepository.findByUserId(userId).orElse(new Profile());
        return ProfileDto.fromEntity(profile);
    }

    public ProfileDto updateProfile(Long userId, ProfileDto dto) {
        Profile profile = profileRepository.findByUserId(userId).orElseGet(() -> {
            Profile p = new Profile();
            p.setUserId(userId);
            return p;
        });

        // Partial update: only overwrite a field if the client actually sent it (non-null)
        if (dto.getFirstName() != null) profile.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) profile.setLastName(dto.getLastName());
        if (dto.getFullName() != null) profile.setFullName(dto.getFullName());
        if (dto.getEmail() != null) profile.setEmail(dto.getEmail());
        if (dto.getPhone() != null) profile.setPhone(dto.getPhone());
        if (dto.getGender() != null) profile.setGender(dto.getGender());
        if (dto.getDateOfBirth() != null) profile.setDateOfBirth(dto.getDateOfBirth());
        if (dto.getFatherName() != null) profile.setFatherName(dto.getFatherName());
        if (dto.getMotherName() != null) profile.setMotherName(dto.getMotherName());
        if (dto.getCategory() != null) profile.setCategory(dto.getCategory());
        if (dto.getReligion() != null) profile.setReligion(dto.getReligion());
        if (dto.getPwd() != null) profile.setPwd(dto.getPwd());
        if (dto.getNationality() != null) profile.setNationality(dto.getNationality());
        if (dto.getCitizenship() != null) profile.setCitizenship(dto.getCitizenship());
        if (dto.getMaritalStatus() != null) profile.setMaritalStatus(dto.getMaritalStatus());

        return ProfileDto.fromEntity(profileRepository.save(profile));
    }

    public void deleteProfile(Long userId) {
        profileRepository.findByUserId(userId).ifPresent(profileRepository::delete);
    }

    // ================= ADDRESS =================

    public AddressDto getAddress(Long userId) {
        Address address = addressRepository.findByUserId(userId).orElse(new Address());
        return AddressDto.fromEntity(address);
    }

    public AddressDto updateAddress(Long userId, AddressDto dto) {
        Address address = addressRepository.findByUserId(userId).orElseGet(() -> {
            Address a = new Address();
            a.setUserId(userId);
            return a;
        });

        if (dto.getAddress() != null) address.setAddress(dto.getAddress());
        if (dto.getCity() != null) address.setCity(dto.getCity());
        if (dto.getState() != null) address.setState(dto.getState());
        if (dto.getCountry() != null) address.setCountry(dto.getCountry());
        if (dto.getPincode() != null) address.setPincode(dto.getPincode());

        return AddressDto.fromEntity(addressRepository.save(address));
    }

    // ================= EDUCATION =================

    public EducationDto getEducation(Long userId) {
        Education education = educationRepository.findByUserId(userId).orElse(new Education());
        return EducationDto.fromEntity(education);
    }

    public EducationDto updateEducation(Long userId, EducationDto dto) {
        Education education = educationRepository.findByUserId(userId).orElseGet(() -> {
            Education e = new Education();
            e.setUserId(userId);
            return e;
        });

        if (dto.getSchool() != null) education.setSchool(dto.getSchool());
        if (dto.getCollege() != null) education.setCollege(dto.getCollege());
        if (dto.getUniversity() != null) education.setUniversity(dto.getUniversity());
        if (dto.getBoard() != null) education.setBoard(dto.getBoard());
        if (dto.getDegree() != null) education.setDegree(dto.getDegree());
        if (dto.getCourse() != null) education.setCourse(dto.getCourse());
        if (dto.getStream() != null) education.setStream(dto.getStream());
        if (dto.getPassingYear() != null) education.setPassingYear(dto.getPassingYear());
        if (dto.getPercentage() != null) education.setPercentage(dto.getPercentage());
        if (dto.getGrade() != null) education.setGrade(dto.getGrade());

        return EducationDto.fromEntity(educationRepository.save(education));
    }

    // ================= CAREER =================

    public CareerDto getCareer(Long userId) {
        Career career = careerRepository.findByUserId(userId).orElse(new Career());
        return CareerDto.fromEntity(career);
    }

    public CareerDto updateCareer(Long userId, CareerDto dto) {
        Career career = careerRepository.findByUserId(userId).orElseGet(() -> {
            Career c = new Career();
            c.setUserId(userId);
            return c;
        });

        if (dto.getSkills() != null) career.setSkills(dto.getSkills());
        if (dto.getExperience() != null) career.setExperience(dto.getExperience());
        if (dto.getCurrentStatus() != null) career.setCurrentStatus(dto.getCurrentStatus());
        if (dto.getPreferredRole() != null) career.setPreferredRole(dto.getPreferredRole());
        if (dto.getPreferredLocation() != null) career.setPreferredLocation(dto.getPreferredLocation());

        return CareerDto.fromEntity(careerRepository.save(career));
    }

    // ================= SOCIAL =================

    public SocialDto getSocial(Long userId) {
        SocialProfile social = socialProfileRepository.findByUserId(userId).orElse(new SocialProfile());
        return SocialDto.fromEntity(social);
    }

    public SocialDto updateSocial(Long userId, SocialDto dto) {
        SocialProfile social = socialProfileRepository.findByUserId(userId).orElseGet(() -> {
            SocialProfile s = new SocialProfile();
            s.setUserId(userId);
            return s;
        });

        if (dto.getLinkedin() != null) social.setLinkedin(dto.getLinkedin());
        if (dto.getGithub() != null) social.setGithub(dto.getGithub());
        if (dto.getPortfolio() != null) social.setPortfolio(dto.getPortfolio());

        return SocialDto.fromEntity(socialProfileRepository.save(social));
    }

}
