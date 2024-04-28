ARG JDK_TAG=11

FROM openjdk:$JDK_TAG AS builder
WORKDIR /tmp/ilotterytea/huinya/bot
    COPY . .

    RUN ./gradlew bot:dist