package com.devj1988.codedojo.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class Problem {
    int problemId;
    String title;
    String description;
    Map<String, String> solutionStubs;
    List<TestCase> testCaseList;
}
