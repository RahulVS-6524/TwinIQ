package com.twiniq.controller;

import com.twiniq.dto.BusinessRequest;
import com.twiniq.dto.BusinessResponse;
import com.twiniq.entity.Business;
import com.twiniq.service.BusinessService;
import com.twiniq.entity.BusinessUser;
import com.twiniq.repository.BusinessUserRepository;
import com.twiniq.security.BusinessSecurityService;
import com.twiniq.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses")
public class BusinessController {

    private final BusinessService businessService;
    private final BusinessSecurityService businessSecurityService;
    private final BusinessUserRepository businessUserRepository;

    public BusinessController(
            BusinessService businessService,
            BusinessSecurityService businessSecurityService,
            BusinessUserRepository businessUserRepository) {
        this.businessService = businessService;
        this.businessSecurityService = businessSecurityService;
        this.businessUserRepository = businessUserRepository;
    }

    @PostMapping
    public ResponseEntity<BusinessResponse> createBusiness(
            @Valid @RequestBody BusinessRequest request,
            Authentication authentication) {

        try {
            Business savedBusiness = businessService.createBusiness(request);

            // Auto-assign created business to the requesting user if authenticated and not admin
            if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal userPrincipal) {
                businessUserRepository.save(new BusinessUser(userPrincipal.getId(), savedBusiness.getId()));
            }

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(BusinessResponse.fromEntity(savedBusiness));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }
    }

    @GetMapping
    public ResponseEntity<List<BusinessResponse>> getAllBusinesses(Authentication authentication) {
        List<Long> accessibleIds = businessSecurityService.getAccessibleBusinessIds(authentication);

        List<BusinessResponse> response = businessService.getAllBusinesses()
                .stream()
                .filter(b -> accessibleIds.isEmpty() || accessibleIds.contains(b.getId()) || businessSecurityService.isAdmin(authentication))
                .map(BusinessResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@businessSecurityService.canAccessBusiness(authentication, #id)")
    public ResponseEntity<BusinessResponse> getBusinessById(
            @PathVariable Long id) {

        return businessService.getBusinessById(id)
                .map(BusinessResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{businessCode}")
    public ResponseEntity<BusinessResponse> getBusinessByCode(
            @PathVariable String businessCode) {

        return businessService
                .getBusinessByCode(businessCode)
                .map(BusinessResponse::fromEntity)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteBusiness(
            @PathVariable Long id) {

        try {
            businessService.deleteBusiness(id);

            return ResponseEntity.noContent().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}