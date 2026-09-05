package com.twiniq.repository;

import com.twiniq.entity.DNAParameterHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DNAParameterHistoryRepository extends JpaRepository<DNAParameterHistory, Long> {

    List<DNAParameterHistory> findByBusinessDNA_IdOrderByChangedAtDesc(Long businessDnaId);
}
