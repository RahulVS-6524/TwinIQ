package com.twiniq.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "twin_evolution")
public class TwinEvolution {

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
    @JoinColumn(name = "simulation_id", nullable = false)
    private Simulation simulation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actual_outcome_id", nullable = false)
    private ActualOutcome actualOutcome;

    @Column(name = "revenue_variance_percent", precision = 5, scale = 2)
    private BigDecimal revenueVariancePercent;

    @Column(name = "profit_margin_variance_points", precision = 5, scale = 2)
    private BigDecimal profitMarginVariancePoints;

    @Column(name = "cac_variance_percent", precision = 5, scale = 2)
    private BigDecimal cacVariancePercent;

    @Column(name = "overall_accuracy_percent", precision = 5, scale = 2)
    private BigDecimal overallAccuracyPercent;

    @Column(name = "evolution_insight", columnDefinition = "TEXT")
    private String evolutionInsight;

    @Column(name = "calibration_action", columnDefinition = "TEXT")
    private String calibrationAction;

    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (appliedAt == null) {
            appliedAt = LocalDateTime.now();
        }
    }

    public TwinEvolution() {
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

    public Simulation getSimulation() {
        return simulation;
    }

    public void setSimulation(Simulation simulation) {
        this.simulation = simulation;
    }

    public ActualOutcome getActualOutcome() {
        return actualOutcome;
    }

    public void setActualOutcome(ActualOutcome actualOutcome) {
        this.actualOutcome = actualOutcome;
    }

    public BigDecimal getRevenueVariancePercent() {
        return revenueVariancePercent;
    }

    public void setRevenueVariancePercent(BigDecimal revenueVariancePercent) {
        this.revenueVariancePercent = revenueVariancePercent;
    }

    public BigDecimal getProfitMarginVariancePoints() {
        return profitMarginVariancePoints;
    }

    public void setProfitMarginVariancePoints(BigDecimal profitMarginVariancePoints) {
        this.profitMarginVariancePoints = profitMarginVariancePoints;
    }

    public BigDecimal getCacVariancePercent() {
        return cacVariancePercent;
    }

    public void setCacVariancePercent(BigDecimal cacVariancePercent) {
        this.cacVariancePercent = cacVariancePercent;
    }

    public BigDecimal getOverallAccuracyPercent() {
        return overallAccuracyPercent;
    }

    public void setOverallAccuracyPercent(BigDecimal overallAccuracyPercent) {
        this.overallAccuracyPercent = overallAccuracyPercent;
    }

    public String getEvolutionInsight() {
        return evolutionInsight;
    }

    public void setEvolutionInsight(String evolutionInsight) {
        this.evolutionInsight = evolutionInsight;
    }

    public String getCalibrationAction() {
        return calibrationAction;
    }

    public void setCalibrationAction(String calibrationAction) {
        this.calibrationAction = calibrationAction;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
