package com.twiniq.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class BusinessDNARequest {

    @NotNull(message = "Revenue is required")
    @DecimalMin(value = "0.0", message = "Revenue must not be negative")
    private BigDecimal revenue;

    @NotNull(message = "Profit margin is required")
    @DecimalMin(value = "-100.0", message = "Profit margin must be between -100 and 100")
    @DecimalMax(value = "100.0", message = "Profit margin must be between -100 and 100")
    private BigDecimal profitMargin;

    @NotNull(message = "Customer retention is required")
    @DecimalMin(value = "0.0", message = "Customer retention must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Customer retention must be between 0 and 100")
    private BigDecimal customerRetention;

    @NotNull(message = "Customer acquisition cost is required")
    @DecimalMin(value = "0.0", message = "Customer acquisition cost must not be negative")
    private BigDecimal customerAcquisitionCost;

    @NotNull(message = "Operational efficiency is required")
    @DecimalMin(value = "0.0", message = "Operational efficiency must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Operational efficiency must be between 0 and 100")
    private BigDecimal operationalEfficiency;

    @NotNull(message = "Market growth is required")
    @DecimalMin(value = "-100.0", message = "Market growth must be between -100 and 100")
    @DecimalMax(value = "100.0", message = "Market growth must be between -100 and 100")
    private BigDecimal marketGrowth;

    @NotNull(message = "Digital maturity is required")
    @DecimalMin(value = "0.0", message = "Digital maturity must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Digital maturity must be between 0 and 100")
    private BigDecimal digitalMaturity;

    @NotNull(message = "Financial stability is required")
    @DecimalMin(value = "0.0", message = "Financial stability must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Financial stability must be between 0 and 100")
    private BigDecimal financialStability;

    @NotNull(message = "Innovation capability is required")
    @DecimalMin(value = "0.0", message = "Innovation capability must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Innovation capability must be between 0 and 100")
    private BigDecimal innovationCapability;

    @NotNull(message = "Risk level is required")
    @DecimalMin(value = "0.0", message = "Risk level must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Risk level must be between 0 and 100")
    private BigDecimal riskLevel;

    @NotNull(message = "Competitive strength is required")
    @DecimalMin(value = "0.0", message = "Competitive strength must be between 0 and 100")
    @DecimalMax(value = "100.0", message = "Competitive strength must be between 0 and 100")
    private BigDecimal competitiveStrength;

    public BusinessDNARequest() {
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public BigDecimal getProfitMargin() {
        return profitMargin;
    }

    public void setProfitMargin(BigDecimal profitMargin) {
        this.profitMargin = profitMargin;
    }

    public BigDecimal getCustomerRetention() {
        return customerRetention;
    }

    public void setCustomerRetention(BigDecimal customerRetention) {
        this.customerRetention = customerRetention;
    }

    public BigDecimal getCustomerAcquisitionCost() {
        return customerAcquisitionCost;
    }

    public void setCustomerAcquisitionCost(BigDecimal customerAcquisitionCost) {
        this.customerAcquisitionCost = customerAcquisitionCost;
    }

    public BigDecimal getOperationalEfficiency() {
        return operationalEfficiency;
    }

    public void setOperationalEfficiency(BigDecimal operationalEfficiency) {
        this.operationalEfficiency = operationalEfficiency;
    }

    public BigDecimal getMarketGrowth() {
        return marketGrowth;
    }

    public void setMarketGrowth(BigDecimal marketGrowth) {
        this.marketGrowth = marketGrowth;
    }

    public BigDecimal getDigitalMaturity() {
        return digitalMaturity;
    }

    public void setDigitalMaturity(BigDecimal digitalMaturity) {
        this.digitalMaturity = digitalMaturity;
    }

    public BigDecimal getFinancialStability() {
        return financialStability;
    }

    public void setFinancialStability(BigDecimal financialStability) {
        this.financialStability = financialStability;
    }

    public BigDecimal getInnovationCapability() {
        return innovationCapability;
    }

    public void setInnovationCapability(BigDecimal innovationCapability) {
        this.innovationCapability = innovationCapability;
    }

    public BigDecimal getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(BigDecimal riskLevel) {
        this.riskLevel = riskLevel;
    }

    public BigDecimal getCompetitiveStrength() {
        return competitiveStrength;
    }

    public void setCompetitiveStrength(BigDecimal competitiveStrength) {
        this.competitiveStrength = competitiveStrength;
    }
}
