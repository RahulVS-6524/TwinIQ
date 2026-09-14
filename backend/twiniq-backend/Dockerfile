# ==============================================================================
# TwinIQ Backend - Production Multi-Stage Dockerfile
# Optimized for high-performance containerized JVM execution
# ==============================================================================

# --- STAGE 1: Build Stage ---
FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /workspace/app

# Cache Maven dependencies layer
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Build application JAR
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# Extract layered JAR for faster container startup and efficient caching
WORKDIR /workspace/app/target/extracted
RUN java -Djarmode=layertools -jar ../twiniq-backend-0.0.1-SNAPSHOT.jar extract

# --- STAGE 2: Lightweight Production Runtime ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add unprivileged runtime user for security compliance
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy extracted layers in optimal cache order
COPY --from=builder /workspace/app/target/extracted/dependencies/ ./
COPY --from=builder /workspace/app/target/extracted/spring-boot-loader/ ./
COPY --from=builder /workspace/app/target/extracted/snapshot-dependencies/ ./
COPY --from=builder /workspace/app/target/extracted/application/ ./

# Expose default application port
EXPOSE 8081

# Production JVM options (container-aware memory limits & GC optimization)
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

# Container liveness & readiness healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]
