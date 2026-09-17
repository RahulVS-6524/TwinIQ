package com.twiniq.controller;

import com.twiniq.dto.ExplanationTraceResponse;
import com.twiniq.dto.SimulationResponse;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.service.SimulationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses/{businessId}")
@PreAuthorize("@businessSecurityService.canAccessBusiness(authentication, #businessId)")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping("/scenarios/{scenarioId}/simulate")
    public ResponseEntity<?> simulateScenario(
            @PathVariable Long businessId,
            @PathVariable Long scenarioId) {
        try {
            SimulationResponse response = simulationService.runSimulation(businessId, scenarioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/simulations")
    public ResponseEntity<List<SimulationResponse>> getSimulations(@PathVariable Long businessId) {
        try {
            return ResponseEntity.ok(simulationService.getSimulations(businessId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/simulations/{simulationId}")
    public ResponseEntity<?> getSimulation(
            @PathVariable Long businessId,
            @PathVariable Long simulationId) {
        try {
            return ResponseEntity.ok(simulationService.getSimulation(businessId, simulationId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/simulations/{simulationId}/explanation")
    public ResponseEntity<?> getExplanation(
            @PathVariable Long businessId,
            @PathVariable Long simulationId) {
        try {
            return ResponseEntity.ok(simulationService.getExplanationTrace(businessId, simulationId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
