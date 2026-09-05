package com.twiniq.dto;

import com.twiniq.entity.ScenarioType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * Request payload for creating a Scenario. Exactly one of the four
 * percent fields must be supplied, matching the given scenarioType.
 * That cross-field rule is enforced in ScenarioService, not here,
 * since Bean Validation does not cleanly express conditional
 * cross-field requirements for this case.
 */
public class ScenarioCreateRequest {

    private Long businessDnaId;

    private Long twinSnapshotId;

    @NotNull
    private ScenarioType scenarioType;

    @DecimalMin(value = "-100.00")
    @DecimalMax(value = "1000.00")
    private BigDecimal priceChangePercent;

    @DecimalMin(value = "-100.00")
    @DecimalMax(value = "1000.00")
    private BigDecimal marketingSpendChangePercent;

    @DecimalMin(value = "-100.00")
    @DecimalMax(value = "1000.00")
    private BigDecimal supplierCostChangePercent;

    @DecimalMin(value = "-100.00")
    @DecimalMax(value = "1000.00")
    private BigDecimal demandChangePercent;

    public ScenarioCreateRequest() {
    }

    public Long getBusinessDnaId() {
        return businessDnaId;
    }

    public void setBusinessDnaId(Long businessDnaId) {
        this.businessDnaId = businessDnaId;
    }

    public Long getTwinSnapshotId() {
        return twinSnapshotId;
    }

    public void setTwinSnapshotId(Long twinSnapshotId) {
        this.twinSnapshotId = twinSnapshotId;
    }

    public ScenarioType getScenarioType() {
        return scenarioType;
    }

    public void setScenarioType(ScenarioType scenarioType) {
        this.scenarioType = scenarioType;
    }

    public BigDecimal getPriceChangePercent() {
        return priceChangePercent;
    }

    public void setPriceChangePercent(BigDecimal priceChangePercent) {
        this.priceChangePercent = priceChangePercent;
    }

    public BigDecimal getMarketingSpendChangePercent() {
        return marketingSpendChangePercent;
    }

    public void setMarketingSpendChangePercent(BigDecimal marketingSpendChangePercent) {
        this.marketingSpendChangePercent = marketingSpendChangePercent;
    }

    public BigDecimal getSupplierCostChangePercent() {
        return supplierCostChangePercent;
    }

    public void setSupplierCostChangePercent(BigDecimal supplierCostChangePercent) {
        this.supplierCostChangePercent = supplierCostChangePercent;
    }

    public BigDecimal getDemandChangePercent() {
        return demandChangePercent;
    }

    public void setDemandChangePercent(BigDecimal demandChangePercent) {
        this.demandChangePercent = demandChangePercent;
    }
}