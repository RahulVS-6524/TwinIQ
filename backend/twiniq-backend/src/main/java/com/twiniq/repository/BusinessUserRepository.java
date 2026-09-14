package com.twiniq.repository;

import com.twiniq.entity.BusinessUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BusinessUserRepository extends JpaRepository<BusinessUser, Long> {

    List<BusinessUser> findByUserId(Long userId);

    List<BusinessUser> findByBusinessId(Long businessId);

    Optional<BusinessUser> findByUserIdAndBusinessId(Long userId, Long businessId);

    boolean existsByUserIdAndBusinessId(Long userId, Long businessId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("DELETE FROM BusinessUser bu WHERE bu.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
