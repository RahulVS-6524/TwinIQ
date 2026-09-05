package com.twiniq.dto;

import com.twiniq.entity.TwinSnapshot;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Read-only representation of a TwinSnapshot returned by the API.
 * The underlying entity is never exposed directly.
 */
public class TwinSnapshotResponse {

    private Long id;
    private Long businessId;
    private Long businessDNAId;
    private LocalDateTime snapshotTime;

    private BigDecimal revenue;
    private BigDecimal profitMargin;
    private BigDecimal customerRetention;
    private BigDecimal customerAcquisitionCost;
    private BigDecimal operationalEfficiency;
    private BigDecimal marketGrowth;
    private BigDecimal digitalMaturity;
    private BigDecimal financialStability;
    private BigDecimal innovationCapability;
    private BigDecimal riskLevel;
    private BigDecimal competitiveStrength;

    private LocalDateTime createdAt;

    public TwinSnapshotResponse() {
    }

    public static TwinSnapshotResponse fromEntity(TwinSnapshot snapshot) {
        TwinSnapshotResponse response = new TwinSnapshotResponse();
        response.id = snapshot.getId();
        response.businessId = snapshot.getBusiness().getId();
        response.businessDNAId = snapshot.getBusinessDNA().getId();
        response.snapshotTime = snapshot.getSnapshotTime();
        response.revenue = snapshot.getRevenue();
        response.profitMargin = snapshot.getProfitMargin();
        response.customerRetention = snapshot.getCustomerRetention();
        response.customerAcquisitionCost = snapshot.getCustomerAcquisitionCost();
        response.operationalEfficiency = snapshot.getOperationalEfficiency();
        response.marketGrowth = snapshot.getMarketGrowth();
        response.digitalMaturity = snapshot.getDigitalMaturity();
        response.financialStability = snapshot.getFinancialStability();
        response.innovationCapability = snapshot.getInnovationCapability();
        response.riskLevel = snapshot.getRiskLevel();
        response.competitiveStrength = snapshot.getCompetitiveStrength();
        response.createdAt = snapshot.getCreatedAt();
        return response;
    }

    public Long getId() {
        return id;
    }

    public Long getBusinessId() {
        return businessId;
    }

    public Long getBusinessDNAId() {
        return businessDNAId;
    }

    public LocalDateTime getSnapshotTime() {
        return snapshotTime;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public BigDecimal getProfitMargin() {
        return profitMargin;
    }

    public BigDecimal getCustomerRetention() {
        return customerRetention;
    }

    public BigDecimal getCustomerAcquisitionCost() {
        return customerAcquisitionCost;
    }

    public BigDecimal getOperationalEfficiency() {
        return operationalEfficiency;
    }

    public BigDecimal getMarketGrowth() {
        return marketGrowth;
    }

    public BigDecimal getDigitalMaturity() {
        return digitalMaturity;
    }

    public BigDecimal getFinancialStability() {
        return financialStability;
    }

    public BigDecimal getInnovationCapability() {
        return innovationCapability;
    }

    public BigDecimal getRiskLevel() {
        return riskLevel;
    }

    public BigDecimal getCompetitiveStrength() {
        return competitiveStrength;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
