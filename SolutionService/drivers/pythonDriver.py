import json, importlib, traceback, tracemalloc, time, signal, argparse, sys


def format_bytes(total_bytes):
    if total_bytes < 1024:
        return f"{total_bytes} B"
    if total_bytes > 1024 and total_bytes < 1024*1024:
        return f"{total_bytes/1024:.2f} KB"
    return f"{total_bytes/(1024*1024):.2f} MB"


def log_driver_message(msg):
    print(f"DRIVER_MSG {msg}")
    sys.stdout.flush()


def read_json_from_file(testfile):
    with open(testfile, 'r') as f:
        return json.loads(f.read())


class TimeoutException(Exception):
    "Raised on Timeout"
    pass


def timeout_handler(signum, frame):
    raise TimeoutException("Timed out!")


def get_solution_obj(usercode_module_name):
    importlib.invalidate_caches()
    module = __import__(usercode_module_name)
    if not hasattr(module, 'Solution'):
        return None
    solution_class = getattr(module, 'Solution')
    return solution_class()


def run_tests(obj, test_specs, exit_on_error=True, timeout_sec=10, showActualExpected=True):
    entrypoint_func = getattr(obj, test_specs['entryPoint'])
    total_cases = len(test_specs['testcases'])
    summary = {
        "total": total_cases,
        "passed": 0,
        "failed": 0,
        "run": 0
    }
    tracemalloc.start()
    start = time.process_time()
    # debug
    # timeout_sec = 100
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(timeout_sec)
    log_driver_message(json.dumps({
        "status": "init",
        "total": total_cases
    }))
    for i, case in enumerate(test_specs['testcases']):
        inp = case["input"]
        log_driver_message(json.dumps({
            "case": i+1,
            "status": "RUNNING"
        }))
        result = {
            "case": i+1
        }
        try:
            summary["run"] += 1
            # print(inp)
            out = entrypoint_func(*inp)
        except TimeoutException as e:
            summary["timeout"] = True
            return summary
        except Exception as e:
            summary["failed"] += 1
            formatted_lines = traceback.format_exc().splitlines()
            if showActualExpected:
                result["details"] = {
                    "input_args": str(inp),
                    "expected": case["output"],
                    "actual": None,
                    "error_trace": formatted_lines[-1:-10:-1]
                }
            log_driver_message(json.dumps(result))
            if exit_on_error:
                break
            else:
                continue
        if out == case["output"]:
            result["result"] = "PASS"
            summary["passed"] += 1
        else:
            result["result"] = "FAIL"
            summary["failed"] += 1
        if showActualExpected:
            result["details"] = {
                "input_args": str(inp),
                "expected": case["output"],
                "actual": out
            }
        log_driver_message(json.dumps(result))
    signal.alarm(0)
    end = time.process_time()
    elapsed_s = end - start
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    summary["peak_mem_usage_formatted"] = format_bytes(peak)
    summary["peak_mem_usage_bytes"] = peak
    summary["cpu_time_taken_s"] = f"{elapsed_s:.3f}"
    return summary


def run_solution(solution_obj, test_specs, timeout, exit_on_error):
    ret = {"exit": True, "error": False}
    if solution_obj is None:
        ret["error"] = True
        ret["error_msg"] = "Solution class not found"
    elif not hasattr(solution_obj, test_specs['entryPoint']):
        ret["error"] = True
        ret["error_msg"] = f"entryPoint {test_specs['entryPoint']} not found"
    else:
        try:
            summary = run_tests(solution_obj, test_specs, exit_on_error, timeout_sec=timeout)
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
    test_specs = read_json_from_file(args.testSpecFile)
    solution_obj = get_solution_obj(args.usercodeFile)
    ret = run_solution(solution_obj, test_specs, args.timeout, args.exitOnError)
    log_driver_message(json.dumps(ret))


main()
