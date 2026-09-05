package com.twiniq.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Represents a "what-if" scenario definition created against a specific
 * Business, a specific BusinessDNA state, and a specific TwinSnapshot
 * baseline. Immutable once created. Simulation execution and results
 * are handled in a later milestone.
 */
@Entity
@Table(name = "scenario")
public class Scenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_dna_id", nullable = false)
    private BusinessDNA businessDNA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "twin_snapshot_id", nullable = false)
    private TwinSnapshot twinSnapshot;

    @Enumerated(EnumType.STRING)
    @Column(name = "scenario_type", nullable = false)
    private ScenarioType scenarioType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ScenarioStatus status;

    @Column(name = "price_change_percent", precision = 5, scale = 2)
    private BigDecimal priceChangePercent;

    @Column(name = "marketing_spend_change_percent", precision = 5, scale = 2)
    private BigDecimal marketingSpendChangePercent;

    @Column(name = "supplier_cost_change_percent", precision = 5, scale = 2)
    private BigDecimal supplierCostChangePercent;

    @Column(name = "demand_change_percent", precision = 5, scale = 2)
    private BigDecimal demandChangePercent;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Scenario() {
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

    public TwinSnapshot getTwinSnapshot() {
        return twinSnapshot;
    }

    public void setTwinSnapshot(TwinSnapshot twinSnapshot) {
        this.twinSnapshot = twinSnapshot;
    }

    public ScenarioType getScenarioType() {
        return scenarioType;
    }

    public void setScenarioType(ScenarioType scenarioType) {
        this.scenarioType = scenarioType;
    }

    public ScenarioStatus getStatus() {
        return status;
    }

    public void setStatus(ScenarioStatus status) {
        this.status = status;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}