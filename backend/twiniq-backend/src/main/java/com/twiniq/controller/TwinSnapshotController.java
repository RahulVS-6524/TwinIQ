package com.twiniq.controller;

import com.twiniq.dto.TwinSnapshotResponse;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.service.TwinSnapshotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses/{businessId}/snapshots")
@CrossOrigin(origins = "http://localhost:5173")
public class TwinSnapshotController {

    private final TwinSnapshotService twinSnapshotService;

    public TwinSnapshotController(TwinSnapshotService twinSnapshotService) {
        this.twinSnapshotService = twinSnapshotService;
    }

    @PostMapping
    public ResponseEntity<TwinSnapshotResponse> createSnapshot(
            @PathVariable Long businessId) {

        try {
            TwinSnapshotResponse response = twinSnapshotService.createSnapshot(businessId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TwinSnapshotResponse>> getSnapshots(
            @PathVariable Long businessId) {

        try {
            return ResponseEntity.ok(twinSnapshotService.getSnapshots(businessId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<TwinSnapshotResponse> getLatestSnapshot(
            @PathVariable Long businessId) {

        try {
            return ResponseEntity.ok(twinSnapshotService.getLatestSnapshot(businessId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{snapshotId}")
    public ResponseEntity<TwinSnapshotResponse> getSnapshot(
            @PathVariable Long businessId,
            @PathVariable Long snapshotId) {

        try {
            return ResponseEntity.ok(twinSnapshotService.getSnapshot(businessId, snapshotId));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
