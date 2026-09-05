package com.twiniq.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents the current strategic/operational "DNA" of a Business.
 * A Business has at most one current BusinessDNA record at a time.
 * Historical changes to individual parameters are tracked separately
 * in {@link DNAParameterHistory}.
 */
@Entity
@Table(name = "business_dna")
public class BusinessDNA {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false, unique = true)
    private Business business;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal revenue;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal profitMargin;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal customerRetention;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal customerAcquisitionCost;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal operationalEfficiency;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal marketGrowth;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal digitalMaturity;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal financialStability;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal innovationCapability;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal riskLevel;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal competitiveStrength;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        lastUpdated = LocalDateTime.now();
    }

    public BusinessDNA() {
    }

    public Long getId() {
        return id;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
