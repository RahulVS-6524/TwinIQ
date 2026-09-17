package com.twiniq.controller;

import com.twiniq.dto.BusinessDNARequest;
import com.twiniq.dto.BusinessDNAResponse;
import com.twiniq.dto.DNAParameterHistoryResponse;
import com.twiniq.exception.DuplicateResourceException;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.service.BusinessDNAService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses/{businessId}/dna")
@PreAuthorize("@businessSecurityService.canAccessBusiness(authentication, #businessId)")
public class BusinessDNAController {

    private final BusinessDNAService businessDNAService;

    public BusinessDNAController(BusinessDNAService businessDNAService) {
        this.businessDNAService = businessDNAService;
    }

    @PostMapping
    public ResponseEntity<BusinessDNAResponse> createDNA(
            @PathVariable Long businessId,
            @Valid @RequestBody BusinessDNARequest request) {

        try {
            BusinessDNAResponse response =
                    businessDNAService.createDNA(businessId, request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping
    public ResponseEntity<BusinessDNAResponse> getDNA(
            @PathVariable Long businessId) {

        try {
            return ResponseEntity.ok(businessDNAService.getDNA(businessId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping
    public ResponseEntity<BusinessDNAResponse> updateDNA(
            @PathVariable Long businessId,
            @Valid @RequestBody BusinessDNARequest request) {

        try {
            return ResponseEntity.ok(businessDNAService.updateDNA(businessId, request));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<DNAParameterHistoryResponse>> getHistory(
            @PathVariable Long businessId) {

        try {
            return ResponseEntity.ok(businessDNAService.getHistory(businessId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
