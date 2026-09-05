package com.twiniq.repository;

import com.twiniq.entity.ActualOutcome;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActualOutcomeRepository extends JpaRepository<ActualOutcome, Long> {

    List<ActualOutcome> findByBusiness_IdOrderByCreatedAtDesc(Long businessId);

    Optional<ActualOutcome> findByDecision_Id(Long decisionId);
}
