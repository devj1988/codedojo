import { useEffect, useState } from 'react';
import { SolutionPane } from './SolutionPane';
import ProblemPane  from './ProblemPane';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Body = () => {

    const [initialCode, setInitialCode] = useState("");
    const [problemDetails, setProblemDetails] = useState({});

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
            if (json.solutionStubs && json.solutionStubs.python) {
                setInitialCode(json.solutionStubs.python);
            }
            setProblemDetails({
                description: json.description
            });
        };
        getProblem();
    }, []);

    return (
        <Container className='Body'>
            <Row>
                <Col className="ProblemPane">
                    <ProblemPane problemDetails={problemDetails}/>
                </Col>
                <Col className='SolutionPane'>
                    <SolutionPane initialCode={initialCode}/>
                </Col>
            </Row>
        </Container>
    ); 
}