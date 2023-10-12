
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
    <h4>Stderr</h4>
    <div className='StdErrBox'>
      {stdoutorerr.map(line => (<p>{line}</p>))}
    </div>
  </div>;
}

const getResultDesc = (result) => {
  console.log("Result", result);
  const {passed, total, failed, running, success, stdout, stderr} = result;
  const progressbarpct = !running ? 100: (passed + failed)*100/total;
  const progressbarvariant = failed === 0 ? "success" : "danger";
  const animatedProgessBar = running ? true : false;

  const status = running ? "Running" :
          (success ? "Success" : "Failed")

  return <div marginTop="5px">
    <h3>{status}</h3>
    { !!stderr ? null : <ProgressBar variant={progressbarvariant} now={progressbarpct} animated={animatedProgessBar} /> }
    {total > 0 ? <span>{`${passed} out of ${total} tests passed`}</span> : null }
    {renderStd(stdout)}
    {renderStd(stderr)}
  </div>;
}

export const TestCaseBox = (props) => {
  const {testcases, result} = props;
  return (
    <Tabs
      defaultActiveKey="testcase"
      className="mb-4"
      variant='underline'
    >
      <Tab eventKey="testcase" title="Testcase">
        <Tabs
          variant='pills'
          className='mt-2 TestCasePills'
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
        {Object.keys(result).length === 0 ? "Click Run or Submit to see Results" : getResultDesc(result)}
      </Tab>
    </Tabs>
  );
}