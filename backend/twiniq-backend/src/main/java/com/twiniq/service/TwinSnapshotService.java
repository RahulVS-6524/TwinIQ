package com.twiniq.service;

import com.twiniq.dto.TwinSnapshotResponse;
import com.twiniq.entity.Business;
import com.twiniq.entity.BusinessDNA;
import com.twiniq.entity.TwinSnapshot;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.BusinessDNARepository;
import com.twiniq.repository.BusinessRepository;
import com.twiniq.repository.TwinSnapshotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TwinSnapshotService {

    private final TwinSnapshotRepository twinSnapshotRepository;
    private final BusinessRepository businessRepository;
    private final BusinessDNARepository businessDNARepository;

    public TwinSnapshotService(TwinSnapshotRepository twinSnapshotRepository,
                                BusinessRepository businessRepository,
                                BusinessDNARepository businessDNARepository) {
        this.twinSnapshotRepository = twinSnapshotRepository;
        this.businessRepository = businessRepository;
        this.businessDNARepository = businessDNARepository;
    }

    /**
     * Creates a frozen snapshot of the business's current BusinessDNA.
     * All values are copied by value (via getters/setters) at this instant,
     * so later changes to the live BusinessDNA never affect this record.
     */
    @Transactional
    public TwinSnapshotResponse createSnapshot(Long businessId) {

        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Business not found with id: " + businessId));

        BusinessDNA dna = businessDNARepository.findByBusiness_Id(businessId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "BusinessDNA not found for business id: " + businessId));

        TwinSnapshot snapshot = new TwinSnapshot();
        snapshot.setBusiness(business);
        snapshot.setBusinessDNA(dna);

        LocalDateTime now = LocalDateTime.now();
        snapshot.setSnapshotTime(now);
        snapshot.setCreatedAt(now);

        snapshot.setRevenue(dna.getRevenue());
        snapshot.setProfitMargin(dna.getProfitMargin());
        snapshot.setCustomerRetention(dna.getCustomerRetention());
        snapshot.setCustomerAcquisitionCost(dna.getCustomerAcquisitionCost());
        snapshot.setOperationalEfficiency(dna.getOperationalEfficiency());
        snapshot.setMarketGrowth(dna.getMarketGrowth());
        snapshot.setDigitalMaturity(dna.getDigitalMaturity());
        snapshot.setFinancialStability(dna.getFinancialStability());
        snapshot.setInnovationCapability(dna.getInnovationCapability());
        snapshot.setRiskLevel(dna.getRiskLevel());
        snapshot.setCompetitiveStrength(dna.getCompetitiveStrength());

        TwinSnapshot saved = twinSnapshotRepository.save(snapshot);

        return TwinSnapshotResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public TwinSnapshotResponse getLatestSnapshot(Long businessId) {

        if (!businessRepository.existsById(businessId)) {
            throw new ResourceNotFoundException("Business not found with id: " + businessId);
        }

        List<TwinSnapshot> snapshots =
                twinSnapshotRepository.findByBusiness_IdOrderBySnapshotTimeDesc(businessId);

        if (snapshots.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No snapshots found for business id: " + businessId);
        }

        return TwinSnapshotResponse.fromEntity(snapshots.get(0));
    }

    @Transactional(readOnly = true)
    public TwinSnapshotResponse getSnapshot(Long businessId, Long snapshotId) {

        TwinSnapshot snapshot = twinSnapshotRepository.findById(snapshotId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Snapshot not found with id: " + snapshotId));

        if (!snapshot.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException(
                    "Snapshot not found with id: " + snapshotId
                            + " for business id: " + businessId);
        }

        return TwinSnapshotResponse.fromEntity(snapshot);
    }

    @Transactional(readOnly = true)
    public List<TwinSnapshotResponse> getSnapshots(Long businessId) {

        if (!businessRepository.existsById(businessId)) {
            throw new ResourceNotFoundException("Business not found with id: " + businessId);
        }

        return twinSnapshotRepository.findByBusiness_IdOrderBySnapshotTimeDesc(businessId)
                .stream()
                .map(TwinSnapshotResponse::fromEntity)
                .toList();
    }
}
