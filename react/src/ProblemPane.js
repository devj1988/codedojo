import { Remark } from 'react-remark';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// export const Problem = () => {
//     return <Remark>{`
//     # N-th Fibonacci number
    
//     Return the n-th *fibonacci* number
//     `}</Remark>
//     ;
// }

const Problem = () => (
    <Remark>{`
  # N-th Fibonacci number
  
  Return the n-th *fibonacci* number
  `}</Remark>
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