package com.twiniq.dto;

import com.twiniq.entity.BusinessDNA;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BusinessDNAResponse {

    private Long id;
    private Long businessId;
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
    private LocalDateTime lastUpdated;

    public BusinessDNAResponse() {
    }

    public static BusinessDNAResponse fromEntity(BusinessDNA dna) {

        BusinessDNAResponse response = new BusinessDNAResponse();

        response.id = dna.getId();
        response.businessId = dna.getBusiness().getId();
        response.revenue = dna.getRevenue();
        response.profitMargin = dna.getProfitMargin();
        response.customerRetention = dna.getCustomerRetention();
        response.customerAcquisitionCost = dna.getCustomerAcquisitionCost();
        response.operationalEfficiency = dna.getOperationalEfficiency();
        response.marketGrowth = dna.getMarketGrowth();
        response.digitalMaturity = dna.getDigitalMaturity();
        response.financialStability = dna.getFinancialStability();
        response.innovationCapability = dna.getInnovationCapability();
        response.riskLevel = dna.getRiskLevel();
        response.competitiveStrength = dna.getCompetitiveStrength();
        response.createdAt = dna.getCreatedAt();
        response.lastUpdated = dna.getLastUpdated();

        return response;
    }

    public Long getId() {
        return id;
    }

    public Long getBusinessId() {
        return businessId;
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

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }
}
