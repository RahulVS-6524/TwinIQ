package com.twiniq.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "actual_outcome")
public class ActualOutcome {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decision_id", nullable = false)
    private Decision decision;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scenario_id", nullable = false)
    private Scenario scenario;

    @Column(name = "actual_revenue", precision = 15, scale = 2)
    private BigDecimal actualRevenue;

    @Column(name = "actual_profit_margin", precision = 5, scale = 2)
    private BigDecimal actualProfitMargin;

    @Column(name = "actual_customer_retention", precision = 5, scale = 2)
    private BigDecimal actualCustomerRetention;

    @Column(name = "actual_customer_acquisition_cost", precision = 10, scale = 2)
    private BigDecimal actualCustomerAcquisitionCost;

    @Column(name = "actual_operational_efficiency", precision = 5, scale = 2)
    private BigDecimal actualOperationalEfficiency;

    @Column(name = "actual_risk_level", precision = 5, scale = 2)
    private BigDecimal actualRiskLevel;

    @Column(name = "realized_at", nullable = false)
    private LocalDateTime realizedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (realizedAt == null) {
            realizedAt = LocalDateTime.now();
        }
    }

    public ActualOutcome() {
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

    public Decision getDecision() {
        return decision;
    }

    public void setDecision(Decision decision) {
        this.decision = decision;
    }

    public Scenario getScenario() {
        return scenario;
    }

    public void setScenario(Scenario scenario) {
        this.scenario = scenario;
    }

    public BigDecimal getActualRevenue() {
        return actualRevenue;
    }

    public void setActualRevenue(BigDecimal actualRevenue) {
        this.actualRevenue = actualRevenue;
    }

    public BigDecimal getActualProfitMargin() {
        return actualProfitMargin;
    }

    public void setActualProfitMargin(BigDecimal actualProfitMargin) {
        this.actualProfitMargin = actualProfitMargin;
    }

    public BigDecimal getActualCustomerRetention() {
        return actualCustomerRetention;
    }

    public void setActualCustomerRetention(BigDecimal actualCustomerRetention) {
        this.actualCustomerRetention = actualCustomerRetention;
    }

    public BigDecimal getActualCustomerAcquisitionCost() {
        return actualCustomerAcquisitionCost;
    }

    public void setActualCustomerAcquisitionCost(BigDecimal actualCustomerAcquisitionCost) {
        this.actualCustomerAcquisitionCost = actualCustomerAcquisitionCost;
    }

    public BigDecimal getActualOperationalEfficiency() {
        return actualOperationalEfficiency;
    }

    public void setActualOperationalEfficiency(BigDecimal actualOperationalEfficiency) {
        this.actualOperationalEfficiency = actualOperationalEfficiency;
    }

    public BigDecimal getActualRiskLevel() {
        return actualRiskLevel;
    }

    public void setActualRiskLevel(BigDecimal actualRiskLevel) {
        this.actualRiskLevel = actualRiskLevel;
    }

    public LocalDateTime getRealizedAt() {
        return realizedAt;
    }

    public void setRealizedAt(LocalDateTime realizedAt) {
        this.realizedAt = realizedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
