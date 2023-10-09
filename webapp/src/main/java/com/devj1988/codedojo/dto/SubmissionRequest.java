package com.devj1988.codedojo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmissionRequest {
    int problemId;
    String language;
    String code;
    boolean sampleRun;
}
