package com.devj1988.codedojo.controller;

import com.devj1988.codedojo.dto.Problem;
import com.devj1988.codedojo.dto.SubmissionRequest;
import com.devj1988.codedojo.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.Optional;

@RestController
public class ProblemPageController {

    private final ProblemService problemService;

    private final WebClient webClient;

    @Autowired
    public ProblemPageController(ProblemService problemService,
                                 WebClient webClient){
        this.problemService = problemService;
        this.webClient = webClient;
    }
    @GetMapping("/problem/{id}")
    @CrossOrigin
    public ResponseEntity<Problem> getProblem(@PathVariable int id) {
        Optional<Problem> problemOptional = problemService.getProblem(id);
        return ResponseEntity.of(problemOptional);
    }

    @PostMapping(value = "/submitSolution", produces= MediaType.TEXT_EVENT_STREAM_VALUE)
    @CrossOrigin
    public Flux<String> submitSolution(@RequestBody SubmissionRequest submissionRequest) {
        return webClient.post()
                .uri("/submitSolution")
                .bodyValue(submissionRequest)
                .retrieve()
                .bodyToFlux(String.class);
    }
}
