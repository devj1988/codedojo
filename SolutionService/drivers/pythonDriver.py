import sys, json, importlib, os, traceback, tracemalloc, time, signal, argparse

def bytesFormat(totalBytes):
    if totalBytes < 1024:
        return f"{totalBytes} B"
    if totalBytes > 1024 and totalBytes < 1024*1024:
        return f"{totalBytes/1024:.2f} KB"
    return f"{totalBytes/(1024*1024):.2f} MB"

def logDriverMessage(msg):
    print(f"DRIVER_MSG {msg}")

def readJson(testfile):
    with open(testfile, 'r') as f:
        return json.loads(f.read())

class TimeoutException(Exception):
    "Raised on Timeout"
    pass
def timeout_handler(signum, frame):
    raise TimeoutException("Timed out!")

def getSolutionObj(usercodeModuleName):
    importlib.invalidate_caches()
    module = __import__(usercodeModuleName)
    if not hasattr(module, 'Solution'):
        return None
    solutionClass = getattr(module, 'Solution')
    return solutionClass()

def runTests(obj, testSpecs, exit_on_error=True, timeoutSec=5):
    func = getattr(obj, testSpecs['entryPoint'])
    summary = {
        "total": len(testSpecs['testcases']),
        "passed": 0,
        "failed": 0,
        "run": 0
    }
    tracemalloc.start()
    start = time.process_time()
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(timeoutSec)
    for i, case in enumerate(testSpecs['testcases']):
        inp = case["input"]
        logDriverMessage(json.dumps({
            "case": i+1,
            "status": "RUNNING"
        }))
        try:
            summary["run"] += 1
            out = func(*inp)
        except TimeoutException as e:
            summary["timeout"] = True
            return summary
        except Exception as e:
            print("hello", e)
            summary["failed"] += 1
            formatted_lines = traceback.format_exc().splitlines()
            logDriverMessage(json.dumps({
                "case": i+1,
                "result": "FAIL",
                "details": {
                    "error_trace": formatted_lines[-1:-10:-1]
                }
            }))
            if exit_on_error:
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
    end = time.process_time()
    elapsed_s = end-start
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    summary["peak_mem_usage_formatted"] = bytesFormat(peak)
    summary["peak_mem_usage_bytes"] = peak
    summary["cpu_time_taken_s"] = elapsed_s
    return summary


def runSolution(solutionObj, testSpecs, timeout, exit_on_error):
    ret = {"exit": True, "error": False}
    if solutionObj is None:
        ret["error"] = True
        ret["error_msg"] = "Solution class not found"
    elif not hasattr(solutionObj, testSpecs['entryPoint']):
        ret["error"] = True
        ret["error_msg"] = f"entryPoint {testSpecs['entryPoint']} not found"
    else:
        try:
            summary = runTests(solutionObj, testSpecs, exit_on_error, timeoutSec=timeout)
            ret["summary"] = summary
        except Exception as e:
            ret["error"] = True
            ret["error_msg"] = str(e)
    return ret

def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--usercodeFile', help='user code file', required=True)
    parser.add_argument('--testSpecFile', help='test spec file', required=True)
    parser.add_argument('--timeout', help='timeout for test suite in s', type=int, default=5)
    parser.add_argument('--exitOnError', help='if True, will not remaining tests and exit early', type=bool, default=True)
    return parser.parse_args()

def main():
    args = parse_args()
    testSpecs = readJson(args.testSpecFile)
    solutionObj = getSolutionObj(args.usercodeFile)
    ret = runSolution(solutionObj, testSpecs, args.timeout, args.exitOnError)
    logDriverMessage(json.dumps(ret))

main()