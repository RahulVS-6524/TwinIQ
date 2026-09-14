package com.twiniq.controller;

import com.twiniq.dto.TwinEvolutionResponse;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.service.TwinEvolutionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses/{businessId}/evolution")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("@businessSecurityService.canAccessBusiness(authentication, #businessId)")
public class TwinEvolutionController {

    private final TwinEvolutionService twinEvolutionService;

    public TwinEvolutionController(TwinEvolutionService twinEvolutionService) {
        this.twinEvolutionService = twinEvolutionService;
    }

    @PostMapping("/evaluate/{outcomeId}")
    public ResponseEntity<?> evaluateAndEvolve(
            @PathVariable Long businessId,
            @PathVariable Long outcomeId) {
        try {
            TwinEvolutionResponse response = twinEvolutionService.evaluateAndEvolve(businessId, outcomeId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<TwinEvolutionResponse>> getEvolutions(@PathVariable Long businessId) {
        try {
            return ResponseEntity.ok(twinEvolutionService.getEvolutions(businessId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
