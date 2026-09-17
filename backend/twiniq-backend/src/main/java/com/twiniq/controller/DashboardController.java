package com.twiniq.controller;

import com.twiniq.dto.DashboardSummaryResponse;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.service.DashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/businesses/{businessId}/dashboard")
@PreAuthorize("@businessSecurityService.canAccessBusiness(authentication, #businessId)")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<?> getDashboardSummary(@PathVariable Long businessId) {
        try {
            DashboardSummaryResponse summary = dashboardService.getDashboardSummary(businessId);
            return ResponseEntity.ok(summary);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
