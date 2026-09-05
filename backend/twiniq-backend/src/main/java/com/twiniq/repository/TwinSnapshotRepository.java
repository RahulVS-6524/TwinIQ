package com.twiniq.repository;

import com.twiniq.entity.TwinSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TwinSnapshotRepository extends JpaRepository<TwinSnapshot, Long> {

    List<TwinSnapshot> findByBusiness_IdOrderBySnapshotTimeDesc(Long businessId);
}
