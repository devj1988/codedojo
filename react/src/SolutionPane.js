import React, {useRef, useState} from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import Button from 'react-bootstrap/Button';
import { TestCaseBox } from './TestCaseBox';
import { fetchEventSource } from "@microsoft/fetch-event-source";
import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FaArrowRotateLeft } from 'react-icons/fa6';

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

export function SolutionPane({initialCode}) {
    const codeRef = useRef(initialCode);
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
      const resultState = {passed: 0, total: 0, failed: 0, running: false};
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
              setResult(resultState);
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
            } else if (parsedData["exit"]) {
              resultState["running"] = false;
              resultState["success"] = resultState["passed"] === resultState["total"];
            } else if (parsedData["stdout"]) {
              resultState["stdout"] = parsedData["stdout"];
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
          },
        });
      };
      fetchData(userCode);
    }
    
    return (
        <Stack>
            <div className="EditorControls">
              <Stack direction="horizontal" gap={3}>
                  <LanguageSelection />
                  <Button variant="secondary"  className="ms-auto RunButton" onClick={runTests} size='sm'>
                    <FaArrowRotateLeft />
                  </Button>
              </Stack>
            </div>
            <div className="Editor">
              <CodeMirror
                  value={initialCode}
                  height="50vh"
                  extensions={[python({})]}
                  onChange={onChange}
                  basicSetup={{
                    autocompletion: false
                  }}
              />
            </div>
            <div className="TestCaseBox">
              <TestCaseBox testcases={testCases} result={result}/>
            </div>
            <div className="p-2">
              <Stack direction="horizontal" style={{flexDirection: "row-reverse"}} gap={3}>
                  <Button variant="success" className="SubmitButton" onClick={submitSolution} size='sm' style={{width: "80px"}}>Submit</Button>
                  <Button variant="secondary"  className="RunButton" onClick={runTests} size='sm'>Run</Button>
              </Stack>
            </div>
      </Stack>
    );
  }