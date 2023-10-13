import { Remark } from 'react-remark';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const Problem = ({description}) => (
  <div className="MarkupText">
    <Remark>{description}</Remark>
  </div>
  );

const Editorial = ()  => (
  <Remark>{`
# N-th Fibonacci number

Here's how to solve this...
`}</Remark>
);
  
const ProblemPane = ({problemDetails}) => {
  const {description} = problemDetails;
  return (
    <Tabs
      defaultActiveKey="problem"
      className="mb-2"
      variant='underline'
    >
      <Tab eventKey="problem" title="Problem">
        <Problem description={description}/>
      </Tab>
      <Tab eventKey="editorial" title="Editorial">
        <Editorial/>
      </Tab>
    </Tabs>
  );
};

export default ProblemPane;