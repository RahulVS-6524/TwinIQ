package com.twiniq.repository;

import com.twiniq.entity.TwinEvolution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TwinEvolutionRepository extends JpaRepository<TwinEvolution, Long> {

    List<TwinEvolution> findByBusiness_IdOrderByAppliedAtDesc(Long businessId);

    Optional<TwinEvolution> findByActualOutcome_Id(Long actualOutcomeId);
}
