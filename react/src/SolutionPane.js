import React, {useCallback, useEffect, useRef, useState} from 'react';
import Button from 'react-bootstrap/Button';
import { TestCaseBox } from './TestCaseBox';
import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FaArrowRotateLeft } from 'react-icons/fa6';
import Editor from './Editor';
import { submitSolutionCall } from './api';

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

function LanguageSelection() {
  return (
    <DropdownButton
            as={ButtonGroup}
            size="sm"
            variant="secondary"
            title="Python"
          >
            <Dropdown.Item eventKey="1">Python</Dropdown.Item>
            <Dropdown.Item eventKey="2">Java</Dropdown.Item>
            <Dropdown.Item eventKey="3">Go</Dropdown.Item>
    </DropdownButton>
  );
}

export function SolutionPane({solutionStubs, problemNumber}) {
    const initialCode = solutionStubs.python;
    const codeRef = useRef(initialCode);
    const [result, setResult] = useState({});
    const [initialCodeState, setInitialCodeState] = useState(initialCode);

    const resetCode = useCallback(() => {
      console.log("resetting code");
      setInitialCodeState("");
      setTimeout(()=> { 
        setInitialCodeState(initialCode)
        codeRef.current = initialCode;
      }, 0)
    }, [initialCode]);

    useEffect(() => {
      setInitialCodeState("");
      setTimeout(()=> {
        setInitialCodeState(initialCode)
        codeRef.current = initialCode;
       }, 0)
    }, [initialCode]);

    const onChange = React.useCallback((value, viewUpdate) => {
      codeRef.current = value;
    }, []);

    const [activeTestCaseBoxTab, setActiveTestCaseBoxTab] = useState("testcase");

    const submitSolution = (isSampleRun) => {
      setActiveTestCaseBoxTab("result");
      const userCode = codeRef.current;
      console.log(userCode);
      const resultState = {passed: 0, total: 0, failed: 0, running: false, complete: false, cases: []};
      const requestBody = {
        "problemId": problemNumber,
        "language": "python",
        "code": userCode,
        "sampleRun": isSampleRun
       };
      const fetchData = async (userCode) => {
        console.log("fetchData called2");
        await submitSolutionCall(requestBody, {
          onopen(res) {
            if (res.ok && res.status === 200) {
              console.log("Connection made ", res);
              setResult(resultState);
              setActiveTestCaseBoxTab("result");
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
              resultState["running"] = true;
              resultState["total"] = parsedData["total"]
            } else if (parsedData["case"]) {
              if (parsedData["result"] === "PASS") {
                resultState["passed"] += 1;
              } else if (parsedData["result"] === "FAIL") {
                resultState["failed"] += 1;
              }
              if (parsedData["details"]) {
                resultState.cases.push({
                  "case": parsedData["case"],
                  "details": parsedData["details"]
                });
              }
              if (parsedData["stdout"]) {
                const caseItem = resultState.cases.filter(caseItem => caseItem["case"] === parsedData["case"]);
                if (caseItem && caseItem[0] && caseItem[0].details) {
                  caseItem[0].details["stdout"] = parsedData["stdout"];
                }
              }
            } else if (parsedData["exit"]) {
              resultState["running"] = false;
              resultState["success"] = resultState["passed"] === resultState["total"];
              if (parsedData["summary"]) {
                if (parsedData["summary"]["timeout"] === true){
                  resultState["timeout"] = true;
                }
                resultState["memoryUsed"] = parsedData["summary"]["peak_mem_usage_formatted"];
                resultState["timeTaken"] = parsedData["summary"]["cpu_time_taken_formatted"];
              }
              if (parsedData["error"]) {
                resultState["error"] = true;
                resultState["errorMsg"] = parsedData["error_msg"]
              }
            } else if (parsedData["stderr"] !== undefined) {
              resultState["complete"] = true;
              resultState["error"] = resultState["error"] || parsedData["stderr"].length > 0;
              resultState["stderr"] = parsedData["stderr"];
            }
            console.log("setResult called", resultState);
            setResult({...resultState});
          },
          onclose() {
            console.log("Connection closed by the server");
          },
          onerror(err) {
            console.log("There was an error from server", err);
            throw err;
          }});
      };
      fetchData(userCode);
    }
    
    return (
        <Stack>
            <div className="EditorControls">
              <Stack direction="horizontal" gap={3}>
                  <LanguageSelection />
                  <Button variant="secondary"  className="ms-auto RunButton" onClick={()=> resetCode()} size='sm'>
                    <FaArrowRotateLeft />
                  </Button>
              </Stack>
            </div>
            <Editor initialCode={initialCodeState} onChange={onChange} />
            <div className="TestCaseBox">
              <TestCaseBox testcases={testCases} result={result} activeTab={activeTestCaseBoxTab} setActiveTab={(key) => setActiveTestCaseBoxTab(key)}/>
            </div>
            <div className="SubmitButtonRow">
              <Stack direction="horizontal" style={{flexDirection: "row-reverse"}} gap={3}>
                  <Button variant="success" className="SubmitButton" onClick={() => submitSolution(false)} size='sm' style={{width: "80px"}}>Submit</Button>
                  <Button variant="secondary"  className="RunButton" onClick={() => submitSolution(true)} size='sm'>Run</Button>
              </Stack>
            </div>
      </Stack>
    );
  }