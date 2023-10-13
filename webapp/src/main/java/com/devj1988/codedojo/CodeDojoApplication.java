package com.devj1988.codedojo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.web.reactive.config.EnableWebFlux;

@SpringBootApplication
@EnableMongoRepositories
public class CodeDojoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodeDojoApplication.class, args);
	}

}
