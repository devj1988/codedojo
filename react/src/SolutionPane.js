import React, {useRef, useState} from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import Button from 'react-bootstrap/Button';
import { TestCaseBox } from './TestCaseBox';
import { fetchEventSource } from "@microsoft/fetch-event-source";

const testCases = [
  {"input": "n=1", "output": 1},
  {"input": "n=5", "output": 3},
  {"input": "n=7", "output": 8},
]

const sampleResult = {
  "total": 10,
  "passed": 5,
  "success": false,
  "last_run": Date.now()
}

export function SolutionPane({initialCode}) {
    const codeRef = useRef();
    const [result, setResult] = useState({});

    const onChange = React.useCallback((value, viewUpdate) => {
      codeRef.current = value;
    }, []);

    const runTests = () => {
      setResult(sampleResult);
    }

    const submitSolution = () => {
      const userCode = codeRef.current;
      console.log(userCode);
      const result = {passed: 0, total: 0, failed: 0, running: false};
      const fetchData = async (userCode) => {
        console.log("fetchData called");
        await fetchEventSource(`http://localhost:8082/submitSolution`, {
          method: "POST",
          headers: {
            Accept: "text/event-stream",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "problemId": 1,
            "language": "python",
            "code": userCode,
            "sampleRun": true
           }),
          onopen(res) {
            if (res.ok && res.status === 200) {
              console.log("Connection made ", res);
            } else if (
              res.status >= 400 &&
              res.status < 500 &&
              res.status !== 429
            ) {
              console.log("Client side error ", res);
            }
          },
          onmessage(event) {
            console.log(event.data);
            const parsedData = JSON.parse(event.data);
            if (parsedData["status"] === "init") {
              result["running"] = true;
              result["total"] = parsedData["total"]
            } else if (parsedData["case"]) {
              if (parsedData["result"] === "PASS") {
                result["passed"] += 1;
              } else if (parsedData["result"] === "FAIL") {
                result["failed"] += 1;
              }
            } else if (parsedData["exit"]) {
              result["running"] = false;
              result["success"] = result["passed"] === result["total"];
            } else if (parsedData["stdout"]) {
              result["stdout"] = parsedData["stdout"];
              result["stderr"] = parsedData["stderr"];
            }
            console.log("setResult called", result);
            setResult(result);
          },
          onclose() {
            console.log("Connection closed by the server");
          },
          onerror(err) {
            console.log("There was an error from server", err);
            throw err;
          },
        });
      };
      fetchData(userCode);
    }
    
    return (
        <div>
            <CodeMirror
                value={initialCode}
                height="400px"
                extensions={[python({})]}
                onChange={onChange}
                ref={codeRef}
            />
            <TestCaseBox testcases={testCases} result={result}/>
            <div style={{"display": "flex", marginTop: '10px'}}>
              <Button variant="primary" onClick={runTests}>Run</Button>
              <Button variant="primary" onClick={submitSolution}>Submit</Button>
            </div>
      </div>
    );
  }