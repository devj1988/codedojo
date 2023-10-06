package com.devj1988.codedojo.service;

import com.devj1988.codedojo.dto.Problem;
import com.devj1988.codedojo.dto.TestCase;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class ProblemService {
    public Optional<Problem> getProblem(int problemId) {
        problemId = 1;
        Problem p = Problem.builder()
                .problemId(problemId)
                .title("Fibonacci number")
                .description("Return nth number in Fibonacci series")
                .solutionStubs(getSolutionStubs(problemId))
                .testCaseList(getTestCases(problemId))
                .build();
        return Optional.of(p);
    }

    private List<TestCase> getTestCases(int problemId) {
        return Arrays.asList(
                TestCase.builder()
                        .input("n=1")
                        .output("1")
                .build(),
                TestCase.builder()
                        .input("n=5")
                        .output("3")
                        .build(),
                TestCase.builder()
                        .input("n=7")
                        .output("8")
                        .build()
                );
    }

    private Map<String, String> getSolutionStubs(int problemId) {
        return Map.of("python", "class Solution:\n" +
                "\tdef fibonacci(self, n):\n" +
                "\t\t# your code here");
    }




}
