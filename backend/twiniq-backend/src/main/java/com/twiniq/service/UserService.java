package com.twiniq.service;

import com.twiniq.dto.*;
import com.twiniq.entity.Business;
import com.twiniq.entity.BusinessUser;
import com.twiniq.entity.User;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.*;
import com.twiniq.security.BusinessSecurityService;
import com.twiniq.security.JwtTokenProvider;
import com.twiniq.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BusinessUserRepository businessUserRepository;
    private final BusinessRepository businessRepository;
    private final TwinSnapshotRepository snapshotRepository;
    private final ScenarioRepository scenarioRepository;
    private final SimulationRepository simulationRepository;
    private final RecommendationRepository recommendationRepository;
    private final DecisionRepository decisionRepository;
    private final ActualOutcomeRepository actualOutcomeRepository;
    private final TwinEvolutionRepository twinEvolutionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final BusinessSecurityService businessSecurityService;
    private final AuditService auditService;

    public UserService(
            UserRepository userRepository,
            BusinessUserRepository businessUserRepository,
            BusinessRepository businessRepository,
            TwinSnapshotRepository snapshotRepository,
            ScenarioRepository scenarioRepository,
            SimulationRepository simulationRepository,
            RecommendationRepository recommendationRepository,
            DecisionRepository decisionRepository,
            ActualOutcomeRepository actualOutcomeRepository,
            TwinEvolutionRepository twinEvolutionRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            BusinessSecurityService businessSecurityService,
            AuditService auditService) {
        this.userRepository = userRepository;
        this.businessUserRepository = businessUserRepository;
        this.businessRepository = businessRepository;
        this.snapshotRepository = snapshotRepository;
        this.scenarioRepository = scenarioRepository;
        this.simulationRepository = simulationRepository;
        this.recommendationRepository = recommendationRepository;
        this.decisionRepository = decisionRepository;
        this.actualOutcomeRepository = actualOutcomeRepository;
        this.twinEvolutionRepository = twinEvolutionRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.businessSecurityService = businessSecurityService;
        this.auditService = auditService;
    }

    @Transactional
    public LoginResponse login(LoginRequest request, String ipAddress) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        List<Long> accessibleBusinessIds = businessSecurityService.getAccessibleBusinessIds(authentication);

        auditService.logAction(principal.getUsername(), "AUTH_LOGIN_SUCCESS", "User", principal.getId(),
                "User successfully authenticated via JWT", ipAddress);

        return new LoginResponse(
                jwt,
                principal.getId(),
                principal.getUsername(),
                principal.getEmail(),
                principal.getFullName(),
                principal.getRole(),
                accessibleBusinessIds
        );
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadCredentialsException("User is not authenticated");
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + principal.getId()));

        List<Long> businessIds = businessSecurityService.getAccessibleBusinessIds(authentication);
        List<BusinessResponse> businesses = businessRepository.findAllById(businessIds).stream()
                .map(BusinessResponse::fromEntity)
                .collect(Collectors.toList());

        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.isEnabled(),
                businessIds,
                businesses
        );
    }

    @Transactional(readOnly = true)
    public List<UserSummaryDto> getAllUsers() {
        List<User> users = userRepository.findAllByOrderByCreatedAtDesc();
        Map<Long, String> businessNameMap = businessRepository.findAll().stream()
                .collect(Collectors.toMap(Business::getId, Business::getBusinessName));

        return users.stream().map(user -> {
            List<BusinessUser> mappings = businessUserRepository.findByUserId(user.getId());
            List<Long> assignedIds = mappings.stream().map(BusinessUser::getBusinessId).collect(Collectors.toList());
            List<String> assignedNames = assignedIds.stream()
                    .map(id -> businessNameMap.getOrDefault(id, "Business #" + id))
                    .collect(Collectors.toList());

            return new UserSummaryDto(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getRole(),
                    user.isEnabled(),
                    assignedIds.size(),
                    assignedIds,
                    assignedNames,
                    user.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    @Transactional
    public UserSummaryDto createUser(CreateUserRequest request, String adminUsername, String ipAddress) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already in use: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use: " + request.getEmail());
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(
                request.getEmail(),
                request.getUsername(),
                encodedPassword,
                request.getFullName(),
                request.getRole() != null ? request.getRole() : "ROLE_USER"
        );

        User saved = userRepository.save(user);

        if (request.getBusinessIds() != null && !request.getBusinessIds().isEmpty()) {
            for (Long businessId : request.getBusinessIds()) {
                if (businessRepository.existsById(businessId)) {
                    businessUserRepository.save(new BusinessUser(saved.getId(), businessId));
                }
            }
        }

        auditService.logAction(adminUsername, "ADMIN_CREATE_USER", "User", saved.getId(),
                "Created user '" + saved.getUsername() + "' with role " + saved.getRole(), ipAddress);

        return getUserSummary(saved.getId());
    }

    @Transactional
    public UserSummaryDto updateUser(Long userId, UpdateUserRequest request, String adminUsername, String ipAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        User updated = userRepository.save(user);

        if (request.getBusinessIds() != null) {
            businessUserRepository.deleteByUserId(userId);
            businessUserRepository.flush();
            request.getBusinessIds().stream().distinct().forEach(bId -> {
                if (businessRepository.existsById(bId)) {
                    businessUserRepository.save(new BusinessUser(userId, bId));
                }
            });
            businessUserRepository.flush();
        }

        auditService.logAction(adminUsername, "ADMIN_UPDATE_USER", "User", updated.getId(),
                "Updated user '" + updated.getUsername() + "' details and assignments", ipAddress);

        return getUserSummary(updated.getId());
    }

    @Transactional
    public UserSummaryDto toggleUserStatus(Long userId, String adminUsername, String ipAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setEnabled(!user.isEnabled());
        User saved = userRepository.save(user);

        auditService.logAction(adminUsername, "ADMIN_TOGGLE_USER_STATUS", "User", saved.getId(),
                "User '" + saved.getUsername() + "' enabled status changed to: " + saved.isEnabled(), ipAddress);

        return getUserSummary(saved.getId());
    }

    @Transactional
    public void assignBusinesses(Long userId, List<Long> businessIds, String adminUsername, String ipAddress) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        businessUserRepository.deleteByUserId(userId);
        businessUserRepository.flush();
        if (businessIds != null) {
            businessIds.stream().distinct().forEach(bId -> {
                if (businessRepository.existsById(bId)) {
                    businessUserRepository.save(new BusinessUser(userId, bId));
                }
            });
            businessUserRepository.flush();
        }

        auditService.logAction(adminUsername, "ADMIN_ASSIGN_BUSINESSES", "User", userId,
                "Assigned businesses " + businessIds + " to user ID " + userId, ipAddress);
    }

    @Transactional(readOnly = true)
    public AdminOverviewResponse getAdminOverview() {
        AdminOverviewResponse overview = new AdminOverviewResponse();
        overview.setTotalUsers(userRepository.count());
        overview.setActiveUsers(userRepository.findAll().stream().filter(User::isEnabled).count());
        overview.setTotalBusinesses(businessRepository.count());
        overview.setTotalSnapshots(snapshotRepository.count());
        overview.setTotalScenarios(scenarioRepository.count());
        overview.setTotalSimulations(simulationRepository.count());
        overview.setTotalRecommendations(recommendationRepository.count());
        overview.setTotalDecisions(decisionRepository.count());
        overview.setTotalActualOutcomes(actualOutcomeRepository.count());
        overview.setTotalEvolutions(twinEvolutionRepository.count());
        overview.setSystemStatus("OPTIMAL");
        overview.setDatabaseStatus("CONNECTED");
        overview.setSecurityMode("ENFORCED_STATELESS_RBAC");
        return overview;
    }

    @Transactional(readOnly = true)
    public UserSummaryDto getUserSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Map<Long, String> businessNameMap = businessRepository.findAll().stream()
                .collect(Collectors.toMap(Business::getId, Business::getBusinessName));

        List<BusinessUser> mappings = businessUserRepository.findByUserId(user.getId());
        List<Long> assignedIds = mappings.stream().map(BusinessUser::getBusinessId).collect(Collectors.toList());
        List<String> assignedNames = assignedIds.stream()
                .map(id -> businessNameMap.getOrDefault(id, "Business #" + id))
                .collect(Collectors.toList());

        return new UserSummaryDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                user.isEnabled(),
                assignedIds.size(),
                assignedIds,
                assignedNames,
                user.getCreatedAt()
        );
    }


}
