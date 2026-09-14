package com.twiniq.service;

import com.twiniq.entity.AuditLog;
import com.twiniq.entity.User;
import com.twiniq.repository.AuditLogRepository;
import com.twiniq.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditService(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public AuditLog logAction(String username, String action, String entityType, Long entityId, String details, String ipAddress) {
        Long userId = null;
        if (username != null) {
            userId = userRepository.findByUsername(username)
                    .map(User::getId)
                    .orElse(null);
        }

        AuditLog auditLog = new AuditLog(userId, username, action, entityType, entityId, details, ipAddress);
        AuditLog saved = auditLogRepository.save(auditLog);
        log.info("Audit logged: user='{}', action='{}', entity='{}#{}'", username, action, entityType, entityId);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getRecentLogs() {
        return auditLogRepository.findTop100ByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<AuditLog> getLogsForUser(Long userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
