package com.twiniq.service;

import com.twiniq.dto.BusinessDNARequest;
import com.twiniq.dto.BusinessDNAResponse;
import com.twiniq.dto.DNAParameterHistoryResponse;
import com.twiniq.entity.Business;
import com.twiniq.entity.BusinessDNA;
import com.twiniq.entity.DNAParameterHistory;
import com.twiniq.exception.DuplicateResourceException;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.BusinessDNARepository;
import com.twiniq.repository.BusinessRepository;
import com.twiniq.repository.DNAParameterHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BusinessDNAService {

    private static final String DEFAULT_UPDATE_REASON = "Manual DNA update";

    private final BusinessDNARepository businessDNARepository;
    private final DNAParameterHistoryRepository dnaParameterHistoryRepository;
    private final BusinessRepository businessRepository;

    public BusinessDNAService(BusinessDNARepository businessDNARepository,
                               DNAParameterHistoryRepository dnaParameterHistoryRepository,
                               BusinessRepository businessRepository) {
        this.businessDNARepository = businessDNARepository;
        this.dnaParameterHistoryRepository = dnaParameterHistoryRepository;
        this.businessRepository = businessRepository;
    }

    @Transactional
    public BusinessDNAResponse createDNA(Long businessId, BusinessDNARequest request) {

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Business not found with id: " + businessId));

        if (businessDNARepository.existsByBusiness_Id(businessId)) {
            throw new DuplicateResourceException(
                    "BusinessDNA already exists for business id: " + businessId);
        }

        BusinessDNA dna = new BusinessDNA();
        dna.setBusiness(business);
        applyRequestToEntity(request, dna);

        BusinessDNA saved = businessDNARepository.save(dna);

        return BusinessDNAResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public BusinessDNAResponse getDNA(Long businessId) {

        BusinessDNA dna = businessDNARepository.findByBusiness_Id(businessId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "BusinessDNA not found for business id: " + businessId));

        return BusinessDNAResponse.fromEntity(dna);
    }

    @Transactional
    public BusinessDNAResponse updateDNA(Long businessId, BusinessDNARequest request) {

        BusinessDNA dna = businessDNARepository.findByBusiness_Id(businessId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "BusinessDNA not found for business id: " + businessId));

        List<DNAParameterHistory> historyEntries = new ArrayList<>();

        recordIfChanged(dna, historyEntries, "revenue",
                dna.getRevenue(), request.getRevenue());
        recordIfChanged(dna, historyEntries, "profitMargin",
                dna.getProfitMargin(), request.getProfitMargin());
        recordIfChanged(dna, historyEntries, "customerRetention",
                dna.getCustomerRetention(), request.getCustomerRetention());
        recordIfChanged(dna, historyEntries, "customerAcquisitionCost",
                dna.getCustomerAcquisitionCost(), request.getCustomerAcquisitionCost());
        recordIfChanged(dna, historyEntries, "operationalEfficiency",
                dna.getOperationalEfficiency(), request.getOperationalEfficiency());
        recordIfChanged(dna, historyEntries, "marketGrowth",
                dna.getMarketGrowth(), request.getMarketGrowth());
        recordIfChanged(dna, historyEntries, "digitalMaturity",
                dna.getDigitalMaturity(), request.getDigitalMaturity());
        recordIfChanged(dna, historyEntries, "financialStability",
                dna.getFinancialStability(), request.getFinancialStability());
        recordIfChanged(dna, historyEntries, "innovationCapability",
                dna.getInnovationCapability(), request.getInnovationCapability());
        recordIfChanged(dna, historyEntries, "riskLevel",
                dna.getRiskLevel(), request.getRiskLevel());
        recordIfChanged(dna, historyEntries, "competitiveStrength",
                dna.getCompetitiveStrength(), request.getCompetitiveStrength());

        applyRequestToEntity(request, dna);
        dna.setLastUpdated(LocalDateTime.now());

        BusinessDNA saved = businessDNARepository.save(dna);

        if (!historyEntries.isEmpty()) {
            dnaParameterHistoryRepository.saveAll(historyEntries);
        }

        return BusinessDNAResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<DNAParameterHistoryResponse> getHistory(Long businessId) {

        BusinessDNA dna = businessDNARepository.findByBusiness_Id(businessId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "BusinessDNA not found for business id: " + businessId));

        return dnaParameterHistoryRepository
                .findByBusinessDNA_IdOrderByChangedAtDesc(dna.getId())
                .stream()
                .map(DNAParameterHistoryResponse::fromEntity)
                .toList();
    }

    /**
     * Copies every editable field from the request onto the entity.
     * Used for both create (all fields new) and update (after diffing for history).
     */
    private void applyRequestToEntity(BusinessDNARequest request, BusinessDNA dna) {
        dna.setRevenue(request.getRevenue());
        dna.setProfitMargin(request.getProfitMargin());
        dna.setCustomerRetention(request.getCustomerRetention());
        dna.setCustomerAcquisitionCost(request.getCustomerAcquisitionCost());
        dna.setOperationalEfficiency(request.getOperationalEfficiency());
        dna.setMarketGrowth(request.getMarketGrowth());
        dna.setDigitalMaturity(request.getDigitalMaturity());
        dna.setFinancialStability(request.getFinancialStability());
        dna.setInnovationCapability(request.getInnovationCapability());
        dna.setRiskLevel(request.getRiskLevel());
        dna.setCompetitiveStrength(request.getCompetitiveStrength());
    }

    /**
     * Adds a DNAParameterHistory entry to the batch if oldValue and newValue differ.
     * BigDecimal comparison uses compareTo (not equals) so that scale differences
     * (e.g. 10.0 vs 10.00) are not treated as changes.
     */
    private void recordIfChanged(BusinessDNA dna,
                                  List<DNAParameterHistory> historyEntries,
                                  String parameterName,
                                  BigDecimal oldValue,
                                  BigDecimal newValue) {

        if (oldValue == null || newValue == null || oldValue.compareTo(newValue) != 0) {
            DNAParameterHistory history = new DNAParameterHistory();
            history.setBusinessDNA(dna);
            history.setParameterName(parameterName);
            history.setOldValue(oldValue);
            history.setNewValue(newValue);
            history.setChangedAt(LocalDateTime.now());
            history.setReason(DEFAULT_UPDATE_REASON);
            historyEntries.add(history);
        }
    }
}
