import { fetchEventSource } from "@microsoft/fetch-event-source";
import { ENABLE_MOCKS, fetchProblemCallMock } from "./apimocks";

const apiHost = "http://localhost:8082";

export const fetchProblemCall = async (problemNumber) => {
    if (ENABLE_MOCKS) {
        return fetchProblemCallMock;
    }
    const response = await fetch(`${apiHost}/problem/${problemNumber}`,
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
    return json;
}

export const submitSolutionCall = async (requestBody, 
    {onopen, onmessage, onclose, onerror, signal}) => {
    const url = `${apiHost}/submitSolution`;

    await fetchEventSource(url, {
          method: "POST",
          headers: {
            Accept: "text/event-stream",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody),
          onopen,
          onmessage,
          onclose,
          onerror,
          signal
        });
};

export const getProblemList = (options) => {

}