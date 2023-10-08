import sys, json, importlib, os

def logDriverMessage(msg):
    print(f"DRIVER_MSG {msg}")

def readJson(testfile):
    with open(testfile, 'r') as f:
        return json.loads(f.read())

def getSolutionObj(usercodeLocation, usercodeModuleName):
    # os.chdir(usercodeLocation)
    print(os.system("ls"))
    importlib.invalidate_caches()
    module = __import__(usercodeModuleName)
    solutionClass = getattr(module, 'Solution')
    return solutionClass()

def runTests(obj, testSpecs):
    func = getattr(obj, testSpecs['entryPoint'])
    for i, case in enumerate(testSpecs['testcases']):
        inp = case["input"]
        logDriverMessage(f"Test case {i+1} running")
        out = func(*inp)
        if out == case["output"]:
            logDriverMessage(f"Test case {i+1} passed")
        else:
            logDriverMessage(f"Test case {i+1} failed")
def main():
    usercodeLocation = sys.argv[1]
    usercodeModuleName = sys.argv[2]
    testSpecFile = sys.argv[3]
    testSpecs = readJson(testSpecFile)
    print(testSpecs)
    solutionObj = getSolutionObj(usercodeLocation, usercodeModuleName)
    if not hasattr(solutionObj, testSpecs['entryPoint']):
        logDriverMessage("entrypoint not found")
        sys.exit(1)
    runTests(solutionObj, testSpecs)


main()