package com.devj1988.codedojo.SolutionService.service;

import com.devj1988.codedojo.SolutionService.dto.SubmissionRequest;
import com.devj1988.codedojo.SolutionService.dto.SubmissionResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

import java.io.*;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
public class PythonSolutionService {
    @Value("${solution.driver.path}")
    String solutionDriverPath;

    @Value("${solution.tmpDir}")
    String solutionTmpDir;

    @Value("${solution.driver.python}")
    String pythonDriver;

    @Value("${solution.driver.stdoutLineLimit:100}")
    int stdoutLineLimit;

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

            Process process = null;
            try {
                process = Runtime.getRuntime().exec(cmd);
                BufferedReader stdoutReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                BufferedReader stderrReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                StringBuilder stdout = new StringBuilder();
                StringBuilder stdErr = new StringBuilder();
                String line = null;
                int stdoutLineCount = 0;
                while ((line = stdoutReader.readLine()) != null) {
                    if (line.startsWith("DRIVER_MSG")) {
                        sink.next(line);
                    } else {
                        stdoutLineCount++;
                        if (stdoutLineCount < stdoutLineLimit) {
                            stdout.append(line + "\n");
                        }
                    }
                }
                while ((line = stderrReader.readLine()) != null) {
                    stdErr.append(line + "\n");
                }
                sink.next(String.format("stdout: \"%s\"", stdout));
                sink.next(String.format("stderr: \"%s\"", stdErr));
                sink.complete();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

        });
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
