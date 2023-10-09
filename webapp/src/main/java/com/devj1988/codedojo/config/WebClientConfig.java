package com.devj1988.codedojo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Value("${solutionservice.host}")
    String host;

    @Value("${solutionservice.port}")
    int port;

    @Bean
    WebClient webClient() {
        return WebClient.builder()
                .baseUrl(String.format(String.format("http://%s:%d", host, port)))
                .build();
    }
}
