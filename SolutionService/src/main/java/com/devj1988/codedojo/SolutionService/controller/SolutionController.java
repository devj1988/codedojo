package com.devj1988.codedojo.SolutionService.controller;

import com.devj1988.codedojo.SolutionService.dto.SubmissionRequest;
import com.devj1988.codedojo.SolutionService.dto.SubmissionResponse;
import com.devj1988.codedojo.SolutionService.service.PythonSolutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
public class SolutionController {

    private final PythonSolutionService solutionService;
    @Autowired
    public SolutionController(PythonSolutionService solutionService) {
        this.solutionService = solutionService;
    }

    @PostMapping(value = "/submitSolution", produces=MediaType.TEXT_EVENT_STREAM_VALUE)
    Flux<String> submitSolution(@RequestBody SubmissionRequest submissionRequest) {
        return solutionService.submit(submissionRequest);
    }
}
