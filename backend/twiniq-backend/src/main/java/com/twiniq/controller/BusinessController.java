package com.twiniq.controller;

import com.twiniq.dto.BusinessRequest;
import com.twiniq.dto.BusinessResponse;
import com.twiniq.entity.Business;
import com.twiniq.service.BusinessService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses")
@CrossOrigin(origins = "http://localhost:5173")
public class BusinessController {

    private final BusinessService businessService;

    public BusinessController(BusinessService businessService) {
        this.businessService = businessService;
    }

    @PostMapping
    public ResponseEntity<BusinessResponse> createBusiness(
            @Valid @RequestBody BusinessRequest request) {

        try {
            Business savedBusiness =
                    businessService.createBusiness(request);

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
    public ResponseEntity<List<BusinessResponse>> getAllBusinesses() {

        List<BusinessResponse> response =
                businessService.getAllBusinesses()
                        .stream()
                        .map(BusinessResponse::fromEntity)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
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