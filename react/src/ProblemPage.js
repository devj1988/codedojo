import { useEffect, useState } from 'react';
import { SolutionPane } from './SolutionPane';
import ProblemPane  from './ProblemPane';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { fetchProblemCall } from './api';

export const ProblemPage = () => {

    const [solutionStubs, setSolutionStubs] = useState("");
    const [problemDetails, setProblemDetails] = useState({});
    const problemNumber = 1;

    useEffect(() => {
        async function getProblem() {
            const json = await fetchProblemCall(problemNumber);
            console.log(json);
            if (json.solutionStubs) {
                setSolutionStubs(json.solutionStubs);
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
                    <SolutionPane solutionStubs={solutionStubs} problemNumber={problemNumber}/>
                </Col>
            </Row>
        </Container>
    ); 
}