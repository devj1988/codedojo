import sys, json, importlib, os, traceback

def logDriverMessage(msg):
    print(f"DRIVER_MSG {msg}")

def readJson(testfile):
    with open(testfile, 'r') as f:
        return json.loads(f.read())

def getSolutionObj(usercodeModuleName):
    importlib.invalidate_caches()
    module = __import__(usercodeModuleName)
    solutionClass = getattr(module, 'Solution')
    return solutionClass()

def runTests(obj, testSpecs, exitOnError=True):
    func = getattr(obj, testSpecs['entryPoint'])
    summary = {
        "total": len(testSpecs['testcases']),
        "passed": 0,
        "failed": 0,
        "run": 0
    }
    for i, case in enumerate(testSpecs['testcases']):
        inp = case["input"]
        logDriverMessage(f"Test case {i+1} running")
        try:
            summary["run"] += 1
            out = func(*inp)
        except Exception as e:
            summary["failed"] += 1
            formatted_lines = traceback.format_exc().splitlines()
            logDriverMessage(json.dumps({
                "case": i+1,
                "result": "FAIL",
                "details": {
                    "error_trace": formatted_lines[-1:-10:-1]
                }
            }))
            if exitOnError:
                break
            else:
                continue
        if out == case["output"]:
            logDriverMessage(json.dumps({
                "case": i+1,
                "result": "PASS"
            }))
            summary["passed"] += 1
        else:
            logDriverMessage(json.dumps({
                "case": i+1,
                "result": "FAIL",
                "details": {
                    "input_args": str(inp),
                    "expected": case["output"],
                    "actual": out
                }
            }))
            summary["failed"] += 1
    return json.dumps({"summary": summary})

def main():
    usercodeModuleName = sys.argv[1]
    testSpecFile = sys.argv[2]
    testSpecs = readJson(testSpecFile)
    solutionObj = getSolutionObj(usercodeModuleName)
    if not hasattr(solutionObj, testSpecs['entryPoint']):
        logDriverMessage("entrypoint not found")
        sys.exit(1)
    ret = {"exit": True, "error": False}
    try:
        summary = runTests(solutionObj, testSpecs)
        logDriverMessage(summary)
    except Exception as e:
        ret["error"] = True
    logDriverMessage(json.dumps(ret))



main()