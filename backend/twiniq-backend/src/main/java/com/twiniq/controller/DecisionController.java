package com.twiniq.controller;

import com.twiniq.dto.DecisionRequest;
import com.twiniq.dto.DecisionResponse;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.service.DecisionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses/{businessId}/decisions")
@CrossOrigin(origins = "http://localhost:5173")
public class DecisionController {

    private final DecisionService decisionService;

    public DecisionController(DecisionService decisionService) {
        this.decisionService = decisionService;
    }

    @PostMapping
    public ResponseEntity<?> recordDecision(
            @PathVariable Long businessId,
            @Valid @RequestBody DecisionRequest request) {
        try {
            DecisionResponse response = decisionService.recordDecision(businessId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<DecisionResponse>> getDecisions(@PathVariable Long businessId) {
        try {
            return ResponseEntity.ok(decisionService.getDecisions(businessId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{decisionId}")
    public ResponseEntity<?> getDecision(
            @PathVariable Long businessId,
            @PathVariable Long decisionId) {
        try {
            return ResponseEntity.ok(decisionService.getDecision(businessId, decisionId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
