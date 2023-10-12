import { Remark } from 'react-remark';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const Problem = () => (
  <div className="MarkupText">
    <Remark>{`
  # N-th Fibonacci number
  
  Return the n-th *fibonacci* number

  ![image](https://assets.leetcode.com/uploads/2020/08/29/main.jpg)
  `}</Remark>
  </div>
  );

const Editorial = ()  => (
  <Remark>{`
# N-th Fibonacci number

Here's how to solve this...
`}</Remark>
);
  
const ProblemPane = () => {
  return (
    <Tabs
      defaultActiveKey="problem"
      className="mb-4"
      variant='underline'
    >
      <Tab eventKey="problem" title="Problem">
        <Problem/>
      </Tab>
      <Tab eventKey="editorial" title="Editorial">
        <Editorial/>
      </Tab>
    </Tabs>
  );
};

export default ProblemPane;