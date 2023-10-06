import React, {useRef, useState} from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import Button from 'react-bootstrap/Button';
import { TestCaseBox } from './TestCaseBox';

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

export function SolutionPane() {
    const code = useRef( `class Solution:
    def fibonacci(n):
      # your code here
  
  
  `);
    const [result, setResult] = useState({});
    const s = code.current;

    const onChange = React.useCallback((value, viewUpdate) => {
      code.current = value;
      console.log(code.current);
    }, []);

    const runTests = () => {
      setResult(sampleResult);
    }

    const submitSolution = () => {
      setResult(sampleResult);
    }
    
    return (
        <div>
            <CodeMirror
                value={s}
                height="600px"
                extensions={[python({})]}
                onChange={onChange}
            />
            <TestCaseBox testcases={testCases} result={result}/>
            <div style={{"display": "flex", marginTop: '10px'}}>
              <Button variant="primary" onClick={runTests}>Run</Button>
              <Button variant="primary" onClick={submitSolution}>Submit</Button>
            </div>
      </div>
    );
  }