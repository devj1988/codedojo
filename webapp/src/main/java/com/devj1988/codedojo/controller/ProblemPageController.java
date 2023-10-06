package com.devj1988.codedojo.controller;

import com.devj1988.codedojo.dto.Problem;
import com.devj1988.codedojo.service.ProblemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class ProblemPageController {

    private final ProblemService problemService;

    @Autowired
    public ProblemPageController(ProblemService problemService){
        this.problemService = problemService;
    }
    @GetMapping("/problem/{id}")
    public ResponseEntity<Problem> getProblem(@PathVariable int id) {
        Optional<Problem> problemOptional = problemService.getProblem(id);
        return ResponseEntity.of(problemOptional);
    }

    public void runSampleCases() {}

    public void submitSolution() {}
}
