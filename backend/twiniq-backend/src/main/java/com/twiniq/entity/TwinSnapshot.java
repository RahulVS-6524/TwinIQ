package com.twiniq.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a frozen copy of a Business's BusinessDNA values at a specific
 * point in time. Once created, the values stored here must never change,
 * even if the live BusinessDNA is later updated.
 */
@Entity
@Table(name = "twin_snapshot")
public class TwinSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_dna_id", nullable = false)
    private BusinessDNA businessDNA;

    @Column(nullable = false)
    private LocalDateTime snapshotTime;

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

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public TwinSnapshot() {
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

    public BusinessDNA getBusinessDNA() {
        return businessDNA;
    }

    public void setBusinessDNA(BusinessDNA businessDNA) {
        this.businessDNA = businessDNA;
    }

    public LocalDateTime getSnapshotTime() {
        return snapshotTime;
    }

    public void setSnapshotTime(LocalDateTime snapshotTime) {
        this.snapshotTime = snapshotTime;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
