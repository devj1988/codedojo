package com.devj1988.codedojo.service;

import com.devj1988.codedojo.db.model.Problem;
import com.devj1988.codedojo.db.model.ProblemRepository;
import com.devj1988.codedojo.dto.ProblemDTO;
import com.devj1988.codedojo.dto.TestCase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ProblemService {

    ProblemRepository problemRepository;

    @Autowired
    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public Optional<ProblemDTO> getProblem(int problemId) {
        Problem problem = problemRepository.findProblemByNumber(problemId);
        if (problem == null) {
            return Optional.empty();
        }
        problemId = 1;
        ProblemDTO p = ProblemDTO.builder()
                .problemId(problemId)
                .title(problem.getTitle())
                .description(problem.getDescription())
                .solutionStubs(getSolutionStubs(problem.getSolutionStubs()))
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

    private Map<String, String> getSolutionStubs(List<Problem.SolutionStub> stubs) {
        Map<String, String> solutionStubsMap = new HashMap<>();
        for (Problem.SolutionStub stub : stubs) {
            solutionStubsMap.put(stub.getLanguage(), stub.getCode());
        }
        return solutionStubsMap;
    }
}
