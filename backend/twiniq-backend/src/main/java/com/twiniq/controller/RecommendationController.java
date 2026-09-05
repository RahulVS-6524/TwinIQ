package com.twiniq.controller;

import com.twiniq.dto.RecommendationResponse;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.service.RecommendationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses/{businessId}")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/simulations/{simulationId}/recommendations")
    public ResponseEntity<?> generateRecommendation(
            @PathVariable Long businessId,
            @PathVariable Long simulationId) {
        try {
            RecommendationResponse response = recommendationService.generateRecommendation(businessId, simulationId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<RecommendationResponse>> getRecommendations(@PathVariable Long businessId) {
        try {
            return ResponseEntity.ok(recommendationService.getRecommendations(businessId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/simulations/{simulationId}/recommendation")
    public ResponseEntity<?> getRecommendationForSimulation(
            @PathVariable Long businessId,
            @PathVariable Long simulationId) {
        try {
            return ResponseEntity.ok(recommendationService.getBySimulationId(businessId, simulationId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
