package com.twiniq.dto;

import com.twiniq.entity.Scenario;
import com.twiniq.entity.ScenarioStatus;
import com.twiniq.entity.ScenarioType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Read-only representation of a Scenario returned by the API.
 * The underlying entity is never exposed directly.
 */
public class ScenarioResponse {

    private Long id;
    private Long businessId;
    private Long businessDnaId;
    private Long twinSnapshotId;
    private ScenarioType scenarioType;
    private ScenarioStatus status;

    private BigDecimal priceChangePercent;
    private BigDecimal marketingSpendChangePercent;
    private BigDecimal supplierCostChangePercent;
    private BigDecimal demandChangePercent;

    private LocalDateTime createdAt;

    public ScenarioResponse() {
    }

    public static ScenarioResponse fromEntity(Scenario scenario) {
        ScenarioResponse response = new ScenarioResponse();
        response.id = scenario.getId();
        response.businessId = scenario.getBusiness().getId();
        response.businessDnaId = scenario.getBusinessDNA().getId();
        response.twinSnapshotId = scenario.getTwinSnapshot().getId();
        response.scenarioType = scenario.getScenarioType();
        response.status = scenario.getStatus();
        response.priceChangePercent = scenario.getPriceChangePercent();
        response.marketingSpendChangePercent = scenario.getMarketingSpendChangePercent();
        response.supplierCostChangePercent = scenario.getSupplierCostChangePercent();
        response.demandChangePercent = scenario.getDemandChangePercent();
        response.createdAt = scenario.getCreatedAt();
        return response;
    }

    public Long getId() {
        return id;
    }

    public Long getBusinessId() {
        return businessId;
    }

    public Long getBusinessDnaId() {
        return businessDnaId;
    }

    public Long getTwinSnapshotId() {
        return twinSnapshotId;
    }

    public ScenarioType getScenarioType() {
        return scenarioType;
    }

    public ScenarioStatus getStatus() {
        return status;
    }

    public BigDecimal getPriceChangePercent() {
        return priceChangePercent;
    }

    public BigDecimal getMarketingSpendChangePercent() {
        return marketingSpendChangePercent;
    }

    public BigDecimal getSupplierCostChangePercent() {
        return supplierCostChangePercent;
    }

    public BigDecimal getDemandChangePercent() {
        return demandChangePercent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}