import { fetchEventSource } from "@microsoft/fetch-event-source";

const apiHost = "http://localhost:8082";

export const fetchProblemCall = async (problemNumber) => {
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
    {onopen, onmessage, onclose, onerror}) => {
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
          onerror
        });
};

export const getProblemList = (options) => {

}