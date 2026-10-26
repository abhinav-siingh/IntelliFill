package com.intellifill.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intellifill.dto.*;
import com.intellifill.entity.ExtractedDocument;
import com.intellifill.repository.ExtractedDocumentRepository;
import com.intellifill.service.ProfileService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private final ExtractedDocumentRepository repository;
    private final ProfileService profiles;
    private final ObjectMapper mapper;

    public DocumentController(ExtractedDocumentRepository repository, ProfileService profiles, ObjectMapper mapper) {
        this.repository = repository; this.profiles = profiles; this.mapper = mapper;
    }

    /** Persists structured fields only. File bytes and extracted raw text are never accepted here. */
    @PostMapping("/extracted")
    @Transactional
    public ApiResponse<String> saveExtracted(@AuthenticationPrincipal Long userId, @RequestBody ExtractedDocumentDto dto) {
        if (userId == null || dto.getDocumentId() == null || dto.getDocumentId().isBlank() ||
                dto.getSourceName() == null || dto.getSourceName().isBlank() || dto.getFields() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "documentId, sourceName, and fields are required");
        if (dto.getSourceName().length() > 255 || dto.getFields().size() > 500)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document metadata or field count exceeds the limit");
        String json;
        try { json = mapper.writeValueAsString(dto.getFields()); }
        catch (JsonProcessingException ex) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid structured fields"); }
        ExtractedDocument row = repository.findByUserIdAndDocumentId(userId, dto.getDocumentId()).orElseGet(ExtractedDocument::new);
        row.setUserId(userId); row.setDocumentId(dto.getDocumentId()); row.setSourceName(dto.getSourceName()); row.setStructuredData(json);
        repository.save(row);
        applyKnownProfileValues(userId, dto.getFields());
        return ApiResponse.success("Extracted data saved");
    }

    private void applyKnownProfileValues(Long userId, Map<String, String> f) {
        ProfileDto p = new ProfileDto(); boolean personal = false;
        personal |= set(f, "personal.firstName", p::setFirstName); personal |= set(f, "personal.lastName", p::setLastName);
        personal |= set(f, "personal.email", p::setEmail); personal |= set(f, "personal.phone", p::setPhone);
        personal |= set(f, "personal.gender", p::setGender); personal |= set(f, "personal.dob", p::setDateOfBirth);
        personal |= set(f, "personal.fatherName", p::setFatherName); personal |= set(f, "personal.motherName", p::setMotherName);
        if (personal) profiles.updateProfile(userId, p);
        AddressDto address = new AddressDto(); boolean hasAddress = false;
        hasAddress |= set(f, "address.address", address::setAddress); hasAddress |= set(f, "address.city", address::setCity);
        hasAddress |= set(f, "address.state", address::setState); hasAddress |= set(f, "address.country", address::setCountry);
        hasAddress |= set(f, "address.pinCode", address::setPincode);
        if (hasAddress) profiles.updateAddress(userId, address);
        CareerDto career = new CareerDto(); boolean hasCareer = false;
        hasCareer |= set(f, "career.skills", career::setSkills);
        hasCareer |= set(f, "career.experience", career::setExperience);
        hasCareer |= set(f, "career.currentStatus", career::setCurrentStatus);
        hasCareer |= set(f, "career.preferredRole", career::setPreferredRole);
        hasCareer |= set(f, "career.preferredLocation", career::setPreferredLocation);
        if (hasCareer) profiles.updateCareer(userId, career);
        EducationDto education = new EducationDto(); boolean hasEducation = false;
        hasEducation |= set(f, "education.graduationDegree", education::setDegree);
        hasEducation |= set(f, "education.college", education::setCollege);
        hasEducation |= set(f, "education.course", education::setCourse);
        hasEducation |= set(f, "education.graduationYear", education::setPassingYear);
        hasEducation |= set(f, "education.graduationPercentage", education::setPercentage);
        if (hasEducation) profiles.updateEducation(userId, education);
        SocialDto social = new SocialDto(); boolean hasSocial = false;
        hasSocial |= set(f, "social.linkedin", social::setLinkedin);
        hasSocial |= set(f, "social.github", social::setGithub);
        hasSocial |= set(f, "social.portfolio", social::setPortfolio);
        if (hasSocial) profiles.updateSocial(userId, social);
    }

    private interface Setter { void accept(String value); }
    private static boolean set(Map<String, String> values, String path, Setter setter) {
        if (!values.containsKey(path)) return false; String value = values.get(path); if (value == null) return false; setter.accept(value); return true;
    }
}


