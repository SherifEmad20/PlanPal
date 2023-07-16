#Dockerizing spring boot application
#Base image openjdk version 8
FROM openjdk:latest

#To add the runnable jar file of the backend project to the container
ADD ./target/planPal-docker.jar planPal-docker.jar

#To specify the command that runs the jar files in the /bin/bash in the container
ENTRYPOINT ["java" ,"-jar", "/planPal-docker.jar"]
