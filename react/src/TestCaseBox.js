
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ProgressBar from 'react-bootstrap/ProgressBar';

function formatDatetime(datetime) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return new Intl.DateTimeFormat("en-US").format(datetime, options);
}

const renderStd = (stdoutorerr) => {
  if (!stdoutorerr || stdoutorerr.length === 0) {
    return null;
  }
  return <div style={{ }}>
    <h5 className='StdErrHeader'>Stderr</h5>
    <div className='StdErrBox'>
      {stdoutorerr.map(line => (<><span>{line}</span><br/></>))}
    </div>
  </div>;
}

const renderCases = (cases) => {
  if (!cases || cases.length === 0) {
    return null;
  }
  return (
      <Tabs
        variant='pills'
        className='mt-2 TestCasePills'
        defaultActiveKey="case-1"
      >
        {cases.map(
          function(item, i) {
            return <Tab eventKey={`case-${i+1}`} title={`Case ${i+1}`}>
                    <div className="inputCard" body>Expected: {item["details"]["expected"]}</div>
                    <div className="inputCard" body>Actual: {item["details"]["actual"]}</div>
                    <p className='StdoutHeader'>Stdout</p>
                    <div className='StdoutBox'>
                      {(item["details"]["stdout"] || ["\n"]).map(line => (<p>{line}</p>))}
                    </div>
                  </Tab>
        }
        )}
    </Tabs>);
}

const getResultDesc = (result) => {
  console.log("Result", result);
  const {passed, total, failed, running, success, stderr, 
    complete, timeout, error, errorMsg, cases, memoryUsed, timeTaken} = result;
  const progressbarpct = !running ? 100: (passed + failed)*100/total;
  const progressbarvariant = !error && ((!complete && failed === 0) || (complete && passed === total)) ? "success" : "danger";
  const animatedProgessBar = running ? true : false;

  let status = "";
  if (error) {
    status = "Error";
  } else {
    status = running ? "Running" :
          (success ? "Success" : "Failed")
  }

  return <div marginTop="5px">
    <div>
      <span style={{fontWeight: 500, fontSize: "1.5rem"}}>{status}</span>{'       '}
      {total > 0 ? <span>{`${passed}/${total} tests passed`}</span> : null }
      {timeout ? <span>(Timeout)</span> : null}
    </div>
    <div>
      {memoryUsed && timeTaken ? <span style={{fontSize: ".75rem"}}>[Memory used: {memoryUsed}, Time Taken: {timeTaken}]</span> : null}
    </div>
    { <ProgressBar variant={progressbarvariant} now={progressbarpct} animated={animatedProgessBar} /> }
    {complete && cases ? renderCases(cases) : null}
    {errorMsg ? <div className="errorCard" body>{errorMsg}</div>: null}
    {renderStd(stderr)}
  </div>;
}

export const TestCaseBox = (props) => {
  const {testcases, result, activeTab, setActiveTab} = props;
  return (
    <Tabs
      variant='underline'
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key)}
    >
      <Tab eventKey="testcase" title="Testcase">
        <Tabs
          variant='pills'
          className='TestCasePills'
          defaultActiveKey="case-1"
        >
           {testcases.map(
            function(item, i) {
              return <Tab eventKey={`case-${i+1}`} title={`Case ${i+1}`}>
                <div className="inputCard" body>{item["input"]}</div>
                </Tab>
           }
           )}
       </Tabs>
      </Tab>
      <Tab eventKey="result" title="Result">
        {Object.keys(result).length === 0 ? <div className="ResultPlaceHolder">Click Run or Submit to see Results</div>: getResultDesc(result)}
      </Tab>
    </Tabs>
  );
}