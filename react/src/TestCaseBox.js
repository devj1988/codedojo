
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

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
  const {total, passed, success, last_run} = result;
  return <div>
    <h3>{success ? "Success": "Failed"}</h3>
    <p>{`${passed} out of ${total} tests passed at ${formatDatetime(last_run)}`}</p>
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