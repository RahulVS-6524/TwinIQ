package com.twiniq.dto;

public class AdminOverviewResponse {

    private long totalUsers;
    private long activeUsers;
    private long totalBusinesses;
    private long totalSnapshots;
    private long totalScenarios;
    private long totalSimulations;
    private long totalRecommendations;
    private long totalDecisions;
    private long totalActualOutcomes;
    private long totalEvolutions;
    private String systemStatus;
    private String databaseStatus;
    private String securityMode;

    public AdminOverviewResponse() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getTotalBusinesses() {
        return totalBusinesses;
    }

    public void setTotalBusinesses(long totalBusinesses) {
        this.totalBusinesses = totalBusinesses;
    }

    public long getTotalSnapshots() {
        return totalSnapshots;
    }

    public void setTotalSnapshots(long totalSnapshots) {
        this.totalSnapshots = totalSnapshots;
    }

    public long getTotalScenarios() {
        return totalScenarios;
    }

    public void setTotalScenarios(long totalScenarios) {
        this.totalScenarios = totalScenarios;
    }

    public long getTotalSimulations() {
        return totalSimulations;
    }

    public void setTotalSimulations(long totalSimulations) {
        this.totalSimulations = totalSimulations;
    }

    public long getTotalRecommendations() {
        return totalRecommendations;
    }

    public void setTotalRecommendations(long totalRecommendations) {
        this.totalRecommendations = totalRecommendations;
    }

    public long getTotalDecisions() {
        return totalDecisions;
    }

    public void setTotalDecisions(long totalDecisions) {
        this.totalDecisions = totalDecisions;
    }

    public long getTotalActualOutcomes() {
        return totalActualOutcomes;
    }

    public void setTotalActualOutcomes(long totalActualOutcomes) {
        this.totalActualOutcomes = totalActualOutcomes;
    }

    public long getTotalEvolutions() {
        return totalEvolutions;
    }

    public void setTotalEvolutions(long totalEvolutions) {
        this.totalEvolutions = totalEvolutions;
    }

    public String getSystemStatus() {
        return systemStatus;
    }

    public void setSystemStatus(String systemStatus) {
        this.systemStatus = systemStatus;
    }

    public String getDatabaseStatus() {
        return databaseStatus;
    }

    public void setDatabaseStatus(String databaseStatus) {
        this.databaseStatus = databaseStatus;
    }

    public String getSecurityMode() {
        return securityMode;
    }

    public void setSecurityMode(String securityMode) {
        this.securityMode = securityMode;
    }
}
