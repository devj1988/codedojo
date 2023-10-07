package com.devj1988.codedojo.SolutionService.dto;

import lombok.Data;

@Data
public class SubmissionRequest {
    int problemId;
    String language;
    String code;
    boolean sampleRun;
}
