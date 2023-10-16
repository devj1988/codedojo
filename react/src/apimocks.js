export const ENABLE_MOCKS = true

export const fetchProblemCallMock = {
    "problemId": 1,
    "title": "Fibonacci numbers",
    "description": "\n  # N-th Fibonacci number\n  \n  Return the n-th *fibonacci* number\n\n  ![image](https://i.pinimg.com/originals/98/82/d5/9882d569f7e0b5665fe3b2edd5069b06.png)\n\n  0 <= n <= 200\n\n  ",
    "solutionStubs": {
        "python": "class Solution:\n  def fibonacci(self, n):\n    # your code here\n\n"
    },
    "testCaseList": [
        {
            "input": "n=1",
            "output": "1"
        },
        {
            "input": "n=5",
            "output": "3"
        },
        {
            "input": "n=7",
            "output": "8"
        }
    ]
}