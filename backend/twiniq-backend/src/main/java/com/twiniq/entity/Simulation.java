package com.twiniq.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "simulation")
public class Simulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scenario_id", nullable = false)
    private Scenario scenario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "twin_snapshot_id", nullable = false)
    private TwinSnapshot twinSnapshot;

    @Column(name = "projected_revenue", precision = 15, scale = 2)
    private BigDecimal projectedRevenue;

    @Column(name = "projected_profit_margin", precision = 5, scale = 2)
    private BigDecimal projectedProfitMargin;

    @Column(name = "projected_customer_retention", precision = 5, scale = 2)
    private BigDecimal projectedCustomerRetention;

    @Column(name = "projected_customer_acquisition_cost", precision = 10, scale = 2)
    private BigDecimal projectedCustomerAcquisitionCost;

    @Column(name = "projected_operational_efficiency", precision = 5, scale = 2)
    private BigDecimal projectedOperationalEfficiency;

    @Column(name = "projected_risk_level", precision = 5, scale = 2)
    private BigDecimal projectedRiskLevel;

    @Column(name = "revenue_impact_percent", precision = 5, scale = 2)
    private BigDecimal revenueImpactPercent;

    @Column(name = "profit_margin_impact_percent", precision = 5, scale = 2)
    private BigDecimal profitMarginImpactPercent;

    @Column(name = "risk_impact_percent", precision = 5, scale = 2)
    private BigDecimal riskImpactPercent;

    @Column(name = "overall_impact", length = 50)
    private String overallImpact;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "explanation_steps", columnDefinition = "TEXT")
    private String explanationSteps;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Simulation() {
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

    public Scenario getScenario() {
        return scenario;
    }

    public void setScenario(Scenario scenario) {
        this.scenario = scenario;
    }

    public TwinSnapshot getTwinSnapshot() {
        return twinSnapshot;
    }

    public void setTwinSnapshot(TwinSnapshot twinSnapshot) {
        this.twinSnapshot = twinSnapshot;
    }

    public BigDecimal getProjectedRevenue() {
        return projectedRevenue;
    }

    public void setProjectedRevenue(BigDecimal projectedRevenue) {
        this.projectedRevenue = projectedRevenue;
    }

    public BigDecimal getProjectedProfitMargin() {
        return projectedProfitMargin;
    }

    public void setProjectedProfitMargin(BigDecimal projectedProfitMargin) {
        this.projectedProfitMargin = projectedProfitMargin;
    }

    public BigDecimal getProjectedCustomerRetention() {
        return projectedCustomerRetention;
    }

    public void setProjectedCustomerRetention(BigDecimal projectedCustomerRetention) {
        this.projectedCustomerRetention = projectedCustomerRetention;
    }

    public BigDecimal getProjectedCustomerAcquisitionCost() {
        return projectedCustomerAcquisitionCost;
    }

    public void setProjectedCustomerAcquisitionCost(BigDecimal projectedCustomerAcquisitionCost) {
        this.projectedCustomerAcquisitionCost = projectedCustomerAcquisitionCost;
    }

    public BigDecimal getProjectedOperationalEfficiency() {
        return projectedOperationalEfficiency;
    }

    public void setProjectedOperationalEfficiency(BigDecimal projectedOperationalEfficiency) {
        this.projectedOperationalEfficiency = projectedOperationalEfficiency;
    }

    public BigDecimal getProjectedRiskLevel() {
        return projectedRiskLevel;
    }

    public void setProjectedRiskLevel(BigDecimal projectedRiskLevel) {
        this.projectedRiskLevel = projectedRiskLevel;
    }

    public BigDecimal getRevenueImpactPercent() {
        return revenueImpactPercent;
    }

    public void setRevenueImpactPercent(BigDecimal revenueImpactPercent) {
        this.revenueImpactPercent = revenueImpactPercent;
    }

    public BigDecimal getProfitMarginImpactPercent() {
        return profitMarginImpactPercent;
    }

    public void setProfitMarginImpactPercent(BigDecimal profitMarginImpactPercent) {
        this.profitMarginImpactPercent = profitMarginImpactPercent;
    }

    public BigDecimal getRiskImpactPercent() {
        return riskImpactPercent;
    }

    public void setRiskImpactPercent(BigDecimal riskImpactPercent) {
        this.riskImpactPercent = riskImpactPercent;
    }

    public String getOverallImpact() {
        return overallImpact;
    }

    public void setOverallImpact(String overallImpact) {
        this.overallImpact = overallImpact;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getExplanationSteps() {
        return explanationSteps;
    }

    public void setExplanationSteps(String explanationSteps) {
        this.explanationSteps = explanationSteps;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
