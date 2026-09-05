package com.twiniq.repository;

import com.twiniq.entity.Decision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DecisionRepository extends JpaRepository<Decision, Long> {

    List<Decision> findByBusiness_IdOrderByCreatedAtDesc(Long businessId);

    List<Decision> findByScenario_Id(Long scenarioId);
}
