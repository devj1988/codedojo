package com.devj1988.codedojo.SolutionService.service;

import com.devj1988.codedojo.SolutionService.dto.SubmissionRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
@Slf4j
public class PythonSolutionService {
    public static final String DRIVER_MSG = "DRIVER_MSG";
    @Value("${solution.driver.path}")
    String solutionDriverPath;

    @Value("${solution.tmpDir}")
    String solutionTmpDir;

    @Value("${solution.driver.python}")
    String pythonDriver;

    @Value("${solution.driver.stdoutLineLimit:100}")
    int stdoutLineLimit;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    private boolean sanityCheck(String code) {
        return !code.contains("import os");
    }

    public Flux<String> submit(SubmissionRequest submissionRequest) {
        return Flux.create(sink -> {
            // sanity check user code
            boolean sanityCheckPassed = sanityCheck(submissionRequest.getCode());
            if (!sanityCheckPassed) {
                sink.next("sanity check failed");
                sink.complete();
                return;
            }
            // save code to temp file
            String userCodeFile = saveUserCode(submissionRequest.getCode());
            // fetch test cases filename
            String testCaseFile = getTestFile();
            // run code and stream output
            boolean earlyExitOnError = !submissionRequest.isSampleRun();
            String[] cmd = getCmd(userCodeFile, testCaseFile, earlyExitOnError);

            try {
                Process process = Runtime.getRuntime().exec(cmd);
                BufferedReader stdoutReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                BufferedReader stderrReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                List<String> stdout = new ArrayList<>();
                List<String> stdErr = new ArrayList<>();
                String line = null;
                int stdoutLineCount = 0;
                int currentTestCase = -1;
                while ((line = stdoutReader.readLine()) != null) {
                    if (line.startsWith(DRIVER_MSG)) {
                        sink.next(format(line.substring(DRIVER_MSG.length())));
                        TestCaseStatus testCaseStatus = getTestCaseStatus(line);
                        if (testCaseStatus != null) {
                            if (testCaseStatus.status.equals("RUNNING")) {
                                currentTestCase = testCaseStatus.caseNumber;
                                stdout = new ArrayList<>();
                            } else {
                                sink.next(getStdOutMessage(currentTestCase, stdout));
                            }
                        }
                    } else {
                        stdoutLineCount++;
                        if (stdoutLineCount < stdoutLineLimit) {
                            stdout.add(line);
                        } else if (stdoutLineCount == stdoutLineLimit) {
                            stdout.add(String.format("....(truncated to %d lines)", stdoutLineLimit));
                        }
                    }
                }
                while ((line = stderrReader.readLine()) != null) {
                    stdErr.add(line);
                }
                Map<String, List<String>> stdmap = Map.of("stdout", stdout,
                        "stderr", stdErr);
                sink.next(objectMapper.writeValueAsString(stdmap));
                sink.complete();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

        });
    }

    private String getStdOutMessage(int currentTestCase, List<String> stdout) {
        try {
            return objectMapper.writeValueAsString(Map.of("case", currentTestCase, "stdout", stdout));
        } catch (JsonProcessingException e) {
            log.error("Failed to write case stdout", e);
        }
        return "{}";
    }

    private TestCaseStatus getTestCaseStatus(String line) {
        if (!line.startsWith(DRIVER_MSG)) {
            return null;
        }
        line = line.substring(DRIVER_MSG.length());

        try {
            JsonNode tree = objectMapper.readTree(line);
            JsonNode caseNode = tree.get("case");
            String status = Optional.ofNullable(tree.get("status")).map(x->x.asText())
                    .orElse("");
            String result = Optional.ofNullable(tree.get("result")).map(x->x.asText())
                    .orElse("");
            return TestCaseStatus.builder()
                    .caseNumber(caseNode.asInt())
                    .status(status)
                    .result(result)
                    .build();
        } catch (Exception e) {
            return null;
        }
    }

    private String format(String string) {
        return string;
    }

    private String[] getCmd(String userCodeFile, String testFile, boolean earlyExitOnError) {
        String cmd = String.format("python3 %s --usercodeFile=%s --testSpecFile=%s --exitOnError=%s",
                solutionTmpDir + "/" + pythonDriver, userCodeFile, testFile, earlyExitOnError);
        return cmd.split(" ");
    }

    private String getTestFile() {
        return "./testFiles/testcases-1.json";
    }
    private String saveUserCode(String code) {
        String fileName = DigestUtils.md5Hex(code + DateTime.now().toString());
        try {
            FileOutputStream outputStream = new FileOutputStream(new File(solutionTmpDir + "/" + fileName + ".py"));
            outputStream.write(code.getBytes(StandardCharsets.UTF_8));
            outputStream.close();
        } catch (IOException e) {
            log.error("error writing code to file", e);
        }
        return fileName;
    }

    @Data
    @Builder
    private static class TestCaseStatus {
        private int caseNumber;
        private String status;
        private String result;
    }
}
