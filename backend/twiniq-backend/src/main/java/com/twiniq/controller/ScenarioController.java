package com.twiniq.controller;

import com.twiniq.dto.ScenarioCreateRequest;
import com.twiniq.dto.ScenarioResponse;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.service.ScenarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/businesses/{businessId}/scenarios")
@PreAuthorize("@businessSecurityService.canAccessBusiness(authentication, #businessId)")
public class ScenarioController {

    private final ScenarioService scenarioService;
    private final com.twiniq.service.ScenarioComparisonService scenarioComparisonService;

    public ScenarioController(ScenarioService scenarioService,
                              com.twiniq.service.ScenarioComparisonService scenarioComparisonService) {
        this.scenarioService = scenarioService;
        this.scenarioComparisonService = scenarioComparisonService;
    }

    @PostMapping("/compare")
    public ResponseEntity<?> compareScenarios(
            @PathVariable Long businessId,
            @Valid @RequestBody com.twiniq.dto.ScenarioCompareRequest request) {
        try {
            var response = scenarioComparisonService.compareScenarios(businessId, request.getScenarioIds());
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/compare")
    public ResponseEntity<?> compareScenariosGet(
            @PathVariable Long businessId,
            @RequestParam List<Long> ids) {
        try {
            var response = scenarioComparisonService.compareScenarios(businessId, ids);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createScenario(
            @PathVariable Long businessId,
            @Valid @RequestBody ScenarioCreateRequest request) {

        try {
            ScenarioResponse response = scenarioService.createScenario(businessId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ScenarioResponse>> getScenarios(
            @PathVariable Long businessId) {

        try {
            return ResponseEntity.ok(scenarioService.getScenarios(businessId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{scenarioId}")
    public ResponseEntity<ScenarioResponse> getScenario(
            @PathVariable Long businessId,
            @PathVariable Long scenarioId) {

        try {
            return ResponseEntity.ok(scenarioService.getScenario(businessId, scenarioId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}