package com.learnhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LearnHubApplication {
    public static void main(String[] args) {
        SpringApplication.run(LearnHubApplication.class, args);
        System.out.println("\n-------------------------------------------------------------");
        System.out.println("🚀 LearnHub Spring Boot Backend is running at http://localhost:8080");
        System.out.println("📚 Swagger API Specs: http://localhost:8080/swagger-ui.html");
        System.out.println("-------------------------------------------------------------\n");
    }
}
