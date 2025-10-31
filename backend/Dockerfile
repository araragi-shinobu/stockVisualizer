# 使用 Maven 和 JDK 17 构建
FROM maven:3.9-eclipse-temurin-17 AS build

# 设置工作目录
WORKDIR /app

# 复制 pom.xml 和下载依赖
COPY pom.xml .
RUN mvn dependency:go-offline

# 复制源代码
COPY src ./src

# 构建应用
RUN mvn clean package -DskipTests

# 运行阶段 - 使用更小的 JRE 镜像
FROM eclipse-temurin:17-jre-alpine

# 设置工作目录
WORKDIR /app

# 从构建阶段复制 JAR 文件
COPY --from=build /app/target/*.jar app.jar

# 暴露端口
EXPOSE 8080

# 运行应用 - 使用 shell 格式来展开环境变量
CMD sh -c "java -Dserver.port=${PORT:-8080} -Xmx450m -Xms256m -jar app.jar"