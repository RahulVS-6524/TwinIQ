package com.twiniq.controller;

import com.twiniq.dto.ActualOutcomeRequest;
import com.twiniq.dto.ActualOutcomeResponse;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.service.ActualOutcomeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses/{businessId}/outcomes")
@PreAuthorize("@businessSecurityService.canAccessBusiness(authentication, #businessId)")
public class ActualOutcomeController {

    private final ActualOutcomeService actualOutcomeService;

    public ActualOutcomeController(ActualOutcomeService actualOutcomeService) {
        this.actualOutcomeService = actualOutcomeService;
    }

    @PostMapping
    public ResponseEntity<?> recordActualOutcome(
            @PathVariable Long businessId,
            @Valid @RequestBody ActualOutcomeRequest request) {
        try {
            ActualOutcomeResponse response = actualOutcomeService.recordActualOutcome(businessId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ActualOutcomeResponse>> getActualOutcomes(@PathVariable Long businessId) {
        try {
            return ResponseEntity.ok(actualOutcomeService.getActualOutcomes(businessId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{outcomeId}")
    public ResponseEntity<?> getActualOutcome(
            @PathVariable Long businessId,
            @PathVariable Long outcomeId) {
        try {
            return ResponseEntity.ok(actualOutcomeService.getActualOutcome(businessId, outcomeId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
