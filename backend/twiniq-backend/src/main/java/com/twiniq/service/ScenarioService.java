package com.twiniq.service;

import com.twiniq.dto.ScenarioCreateRequest;
import com.twiniq.dto.ScenarioResponse;
import com.twiniq.entity.Business;
import com.twiniq.entity.BusinessDNA;
import com.twiniq.entity.Scenario;
import com.twiniq.entity.ScenarioStatus;
import com.twiniq.entity.TwinSnapshot;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.BusinessDNARepository;
import com.twiniq.repository.BusinessRepository;
import com.twiniq.repository.ScenarioRepository;
import com.twiniq.repository.TwinSnapshotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ScenarioService {

    private final ScenarioRepository scenarioRepository;
    private final BusinessRepository businessRepository;
    private final BusinessDNARepository businessDNARepository;
    private final TwinSnapshotRepository twinSnapshotRepository;
    private final TwinSnapshotService twinSnapshotService;

    public ScenarioService(ScenarioRepository scenarioRepository,
                            BusinessRepository businessRepository,
                            BusinessDNARepository businessDNARepository,
                            TwinSnapshotRepository twinSnapshotRepository,
                            TwinSnapshotService twinSnapshotService) {
        this.scenarioRepository = scenarioRepository;
        this.businessRepository = businessRepository;
        this.businessDNARepository = businessDNARepository;
        this.twinSnapshotRepository = twinSnapshotRepository;
        this.twinSnapshotService = twinSnapshotService;
    }

    @Transactional
    public ScenarioResponse createScenario(Long businessId, ScenarioCreateRequest request) {

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Business not found with id: " + businessId));

        BusinessDNA businessDNA;
        if (request.getBusinessDnaId() != null) {
            businessDNA = businessDNARepository.findById(request.getBusinessDnaId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "BusinessDNA not found with id: " + request.getBusinessDnaId()));

            if (!businessDNA.getBusiness().getId().equals(businessId)) {
                throw new ResourceNotFoundException(
                        "BusinessDNA with id: " + request.getBusinessDnaId()
                                + " does not belong to business id: " + businessId);
            }
        } else {
            businessDNA = businessDNARepository.findByBusiness_Id(businessId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "BusinessDNA not found for business id: " + businessId));
        }

        TwinSnapshot twinSnapshot;
        if (request.getTwinSnapshotId() != null) {
            twinSnapshot = twinSnapshotRepository.findById(request.getTwinSnapshotId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "TwinSnapshot not found with id: " + request.getTwinSnapshotId()));

            if (!twinSnapshot.getBusiness().getId().equals(businessId)) {
                throw new ResourceNotFoundException(
                        "TwinSnapshot with id: " + request.getTwinSnapshotId()
                                + " does not belong to business id: " + businessId);
            }
        } else {
            List<TwinSnapshot> snapshots = twinSnapshotRepository.findByBusiness_IdOrderBySnapshotTimeDesc(businessId);
            if (!snapshots.isEmpty()) {
                twinSnapshot = snapshots.get(0);
            } else {
                var snapshotDto = twinSnapshotService.createSnapshot(businessId);
                twinSnapshot = twinSnapshotRepository.findById(snapshotDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Failed to load created snapshot"));
            }
        }

        validateAndNormalizeParameters(request);

        Scenario scenario = new Scenario();
        scenario.setBusiness(business);
        scenario.setBusinessDNA(businessDNA);
        scenario.setTwinSnapshot(twinSnapshot);
        scenario.setScenarioType(request.getScenarioType());
        scenario.setStatus(ScenarioStatus.READY_FOR_SIMULATION);
        scenario.setPriceChangePercent(request.getPriceChangePercent());
        scenario.setMarketingSpendChangePercent(request.getMarketingSpendChangePercent());
        scenario.setSupplierCostChangePercent(request.getSupplierCostChangePercent());
        scenario.setDemandChangePercent(request.getDemandChangePercent());

        Scenario saved = scenarioRepository.save(scenario);

        return ScenarioResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ScenarioResponse getScenario(Long businessId, Long scenarioId) {

        Scenario scenario = scenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Scenario not found with id: " + scenarioId));

        if (!scenario.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException(
                    "Scenario not found with id: " + scenarioId
                            + " for business id: " + businessId);
        }

        return ScenarioResponse.fromEntity(scenario);
    }

    @Transactional(readOnly = true)
    public List<ScenarioResponse> getScenarios(Long businessId) {

        if (!businessRepository.existsById(businessId)) {
            throw new ResourceNotFoundException("Business not found with id: " + businessId);
        }

        return scenarioRepository.findByBusiness_IdOrderByCreatedAtDesc(businessId)
                .stream()
                .map(ScenarioResponse::fromEntity)
                .toList();
    }

    /**
     * Enforces that exactly one of the four percent fields is populated,
     * and that it is the one matching the given scenarioType. This is a
     * conditional cross-field rule that Bean Validation cannot cleanly
     * express, so it is checked here in the service layer.
     */
    private void validateAndNormalizeParameters(ScenarioCreateRequest request) {

        BigDecimal price = request.getPriceChangePercent();
        BigDecimal marketing = request.getMarketingSpendChangePercent();
        BigDecimal supplier = request.getSupplierCostChangePercent();
        BigDecimal demand = request.getDemandChangePercent();

        long populatedCount = java.util.stream.Stream.of(price, marketing, supplier, demand)
                .filter(java.util.Objects::nonNull)
                .count();

        if (populatedCount == 0) {
            // Default matching parameter to 0.00 if user didn't supply an explicit percent
            switch (request.getScenarioType()) {
                case PRICE_CHANGE -> request.setPriceChangePercent(BigDecimal.ZERO);
                case MARKETING_CHANGE -> request.setMarketingSpendChangePercent(BigDecimal.ZERO);
                case SUPPLIER_COST_CHANGE -> request.setSupplierCostChangePercent(BigDecimal.ZERO);
                case DEMAND_SHOCK -> request.setDemandChangePercent(BigDecimal.ZERO);
            }
        } else if (populatedCount == 1) {
            BigDecimal expected = switch (request.getScenarioType()) {
                case PRICE_CHANGE -> price;
                case MARKETING_CHANGE -> marketing;
                case SUPPLIER_COST_CHANGE -> supplier;
                case DEMAND_SHOCK -> demand;
            };

            if (expected == null) {
                throw new IllegalArgumentException(
                        "The supplied parameter field does not match scenarioType: "
                                + request.getScenarioType());
            }
        } else {
            throw new IllegalArgumentException(
                    "At most one parameter field matching the scenarioType may be provided. "
                            + populatedCount + " were provided.");
        }
    }
}