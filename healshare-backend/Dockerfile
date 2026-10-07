FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY src/ src/

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

CMD ["sh", "-c", "java -jar target/*.jar --server.port=${PORT}"]