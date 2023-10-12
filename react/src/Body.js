import { useEffect } from 'react';
import { SolutionPane } from './SolutionPane';
import ProblemPane  from './ProblemPane';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Body = () => {

    useEffect(() => {
        async function getProblem() {
            const response = await fetch("http://localhost:8082/problem/1",
             { 
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              }});

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const json = await response.json();
            console.log(json);
        };
        getProblem();
    }, []);

  const initialCode = `class Solution:
  def fibonacci(self, n):
    # your code here

`;

//   return (
//     <div className='Body' style={{display: 'flex', flexDirection: 'row'}}>
//         <div style={{width: '50%', height: '100%'}}>
//             <Problem />
//         </div>
//         <div style={{width: '50%', height: '100%'}}>
//             <SolutionPane className="SolutionPane" initialCode={initialCode}/>
//         </div>
//     </div>);
    return (
        <Container className='Body'>
            <Row>
                <Col className="ProblemPane">
                    <ProblemPane/>
                </Col>
                <Col className='SolutionPane'>
                    <SolutionPane initialCode={initialCode}/>
                </Col>
            </Row>
        </Container>
    ); 
}