ARG JDK_TAG=11

FROM openjdk:$JDK_TAG AS builder
WORKDIR /tmp/ilotterytea/huinya/api
    COPY . .

    RUN ./gradlew api:shadowJar
    EXPOSE 8085