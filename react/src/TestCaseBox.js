
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

const getResultDesc = (result) => {
  console.log(result);
  const {passed, total, failed, running, success, stdout} = result;
  const progressbarpct = !running ? 100: (passed + failed)*100/total;
  const progressbarvariant = failed === 0 ? "success" : "danger";
  const animatedProgessBar = running ? true : false;

  const status = running ? "Running" :
          (success ? "Success" : "Failed")

  return <div>
    <h3>{status}</h3>
    <ProgressBar variant={progressbarvariant} now={progressbarpct} animated={animatedProgessBar} />
    <p>{`${passed} out of ${total} tests passed`}</p>
  </div>;
}

export const TestCaseBox = (props) => {
  const {testcases, result} = props;
  return (
    <Tabs
      defaultActiveKey="testcase"
      className="mb-3"
    >
      <Tab eventKey="testcase" title="Test Cases">
        <h3>Sample Test Cases</h3>
        <ul>
           {testcases.map(
            function(item, i) {
              return <li key={i}>Input: {item["input"]}; Output: {item["output"]}</li>
           }
           )}
        </ul>
      </Tab>
      <Tab eventKey="result" title="Result">
        {Object.keys(result).length === 0 ? "Click Run or Submit to see Results" : getResultDesc(result)}
      </Tab>
    </Tabs>
  );
}