package com.devj1988.codedojo.SolutionService.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionResponse {
    boolean success;
    int passed;
    int total;
    String stdout;
    String stderr;
}
