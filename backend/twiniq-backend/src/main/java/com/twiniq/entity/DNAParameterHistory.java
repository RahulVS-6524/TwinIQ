package com.twiniq.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Records a single historical change to one parameter of a BusinessDNA record.
 * Written automatically whenever BusinessDNA is updated and a value actually changes.
 */
@Entity
@Table(name = "dna_parameter_history")
public class DNAParameterHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_dna_id", nullable = false)
    private BusinessDNA businessDNA;

    @Column(nullable = false, length = 100)
    private String parameterName;

    @Column(precision = 15, scale = 2)
    private BigDecimal oldValue;

    @Column(precision = 15, scale = 2)
    private BigDecimal newValue;

    @Column(nullable = false)
    private LocalDateTime changedAt;

    @Column(length = 255)
    private String reason;

    @PrePersist
    protected void onCreate() {
        if (changedAt == null) {
            changedAt = LocalDateTime.now();
        }
    }

    public DNAParameterHistory() {
    }

    public Long getId() {
        return id;
    }

    public BusinessDNA getBusinessDNA() {
        return businessDNA;
    }

    public void setBusinessDNA(BusinessDNA businessDNA) {
        this.businessDNA = businessDNA;
    }

    public String getParameterName() {
        return parameterName;
    }

    public void setParameterName(String parameterName) {
        this.parameterName = parameterName;
    }

    public BigDecimal getOldValue() {
        return oldValue;
    }

    public void setOldValue(BigDecimal oldValue) {
        this.oldValue = oldValue;
    }

    public BigDecimal getNewValue() {
        return newValue;
    }

    public void setNewValue(BigDecimal newValue) {
        this.newValue = newValue;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
