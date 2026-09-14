# ==============================================================================
# TwinIQ Backend - Production Multi-Stage Dockerfile
# Uses official Maven Alpine image (eliminates need for .mvn wrapper files)
# ==============================================================================

# --- STAGE 1: Build Stage ---
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY backend/twiniq-backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Build application standalone JAR
COPY backend/twiniq-backend/src ./src
RUN mvn clean package -DskipTests -B

# --- STAGE 2: Lightweight Production Runtime ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add unprivileged runtime user
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy compiled JAR
COPY --from=builder /app/target/twiniq-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
