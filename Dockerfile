# ==============================================================================
# TwinIQ Root Dockerfile (Builds backend when context is repository root)
# ==============================================================================

FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Cache dependencies
COPY backend/twiniq-backend/pom.xml ./
RUN mvn dependency:go-offline -B

# Build application standalone JAR
COPY backend/twiniq-backend/src ./src
RUN mvn clean package -DskipTests -B

# Lightweight Production Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=builder /app/target/twiniq-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8081

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
