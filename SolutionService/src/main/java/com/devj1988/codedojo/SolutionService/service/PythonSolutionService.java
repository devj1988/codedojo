package com.devj1988.codedojo.SolutionService.service;

import com.devj1988.codedojo.SolutionService.dto.SubmissionRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
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
                while ((line = stdoutReader.readLine()) != null) {
                    if (line.startsWith(DRIVER_MSG)) {
                        sink.next(format(line.substring(DRIVER_MSG.length())));
                    } else {
                        stdoutLineCount++;
                        if (stdoutLineCount < stdoutLineLimit) {
                            stdout.add(line);
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
}
