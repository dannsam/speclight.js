"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.given = function (strings) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (step) {
        bddIt('Given', strings, args, step);
    };
};
exports.when = function (strings) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (step) {
        bddIt('When', strings, args, step);
    };
};
exports.then = function (strings) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (step) {
        bddIt('Then', strings, args, step);
    };
};
exports.and = function (strings) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return function (step) {
        bddIt(' And', strings, args, step);
    };
};
function formatArg(args, i) {
    if (i >= args.length) {
        return '';
    }
    var a = args[i];
    switch (typeof a) {
        case 'string': return "\"" + a + "\"";
    }
    return a.toString();
}
function spec(description, definition) {
    debugger;
    var s = it(description, function (done) {
        var spec = new Spec(description, onProcessOutcome);
        definition(spec);
        spec.execute(done);
    });
    var expectations = [];
    var originalAddExpectationResult = s.addExpectationResult;
    s.addExpectationResult = function (passed, result) {
        expectations.push({ passed: passed, result: result });
    };
    var onProcessOutcome = function (original, step) {
        var result = s.getResult();
        var outcome = original;
        if (original.status === Status.Passed) {
            var failedExpectations = expectations.filter(function (x) { return !x.passed; });
            if (failedExpectations.length) {
                // report failed expectations
                outcome = new StepOutcome(step, Status.Failed);
                outcome.error = failedExpectations.map(function (x) { return x.result.message; }).join('\n');
                failedExpectations.forEach(function (x) {
                    originalAddExpectationResult.apply(s, [x.passed, x.result]);
                });
            }
        }
        switch (outcome.status) {
            case Status.Failed:
                debugger;
                // fail(outcome.error);
                break;
            default:
                break;
        }
        return outcome;
    };
    // const originalExpectationFactory = (s as any).expectationFactory;
    // (s as any).expectationFactory = function (...args: any[]) {
    // 	const a = originalExpectationFactory.apply(this, args);
    // 	debugger;
    // 	// const o = a.addExpectationResult;
    // 	a.addExpectationResult = function (passed: boolean, result: jasmine.ExpectationResult) {
    // 		expectations.push({ passed, result });
    // 	};
    // 	return a;
    // };
    // const originalExpectationResultFactory = (s as any).expectationResultFactory;
    // (s as any).expectationResultFactory = function (...args: any[]) {
    // 	debugger;
    // 	return originalExpectationResultFactory.apply(this, args);
    // };
    // let failed = false;
    // let children: any[];
    // const index: number = 0;
    // beforeEach(function (this: any) {
    // 	console.log(this);
    // });
    // afterEach(() => {
    // 	const current = children[index];
    // 	const result = current && current.result;
    // 	const failed = result && result.failedExpectations;
    // 	if (failed && failed.length) {
    // 		debugger;
    // 	}
    // 	index += 1;
    // });
    // describe(description, specs);
}
exports.spec = spec;
/**
 * wrap Suite and Spec prototypes to get access to their data
 */
// wrap constructor
// const queueRunnerPrototype = (jasmine as any).QueueRunner.prototype;
// (jasmine as any).QueueRunner = function (attrs: any, ...rest: any[]) {
// 	debugger;
// 	// wrap node complete
// 	const originalNodeComplete = attrs.onComplete;
// 	let retries = 0;
// 	// tslint:disable-next-line:no-this-assignment
// 	const runner = this;
// 	if (attrs.queueableFns.length > 1) {
// 		attrs.onComplete = function (this: any, ...args: any[]) {
// 			// debugger;
// 			retries += 1;
// 			if (retries <= 1) {
// 				runner.execute();
// 				return;
// 			}
// 			return originalNodeComplete.apply(this, args);
// 		};
// 	}
// 	// const originalQueueRunnerFactory = attrs.queueRunnerFactory;
// 	// attrs.queueRunnerFactory = function (...rest: any[]) {
// 	// 	debugger;
// 	// 	return originalQueueRunnerFactory(...rest);
// 	// };
// 	return queueRunnerPrototype.constructor.apply(this, [attrs, ...rest]);
// };
// (jasmine as any).QueueRunner.prototype = queueRunnerPrototype;
// const beforeAllMock = (jasmine as any).Suite.prototype.beforeAll;
// (jasmine as any).Suite.prototype.beforeAll = function (...args: any[]) {
// 	// self.lastSpec = this.result;
// 	debugger;
// 	beforeAllMock.apply(this, args);
// };
// const executeMock = (jasmine as any).Spec.prototype.execute;
// (jasmine as any).Spec.prototype.execute = function (onComplete: Function, enabled: boolean) {
// 	debugger;
// 	const test = this.result;
// 	// self.lastTest = this.result;
// 	// self.lastTest.start = new Date().getTime();
// 	executeMock.apply(this, [(...args: any[]) => {
// 		if (this.result.failedExpectations.length) {
// 			debugger;
// 			console.log('retry once');
// 			executeMock.apply(this, [onComplete, enabled]);
// 		}
// 		onComplete(...args);
// 		// onComplete(...args);
// 	}, enabled]);
// };
function bddIt(stepType, strings, args, step) {
    var text = stepType + " " + strings.reduce(function (result, item, index) { return result + item + formatArg(args, index); }, '');
    if (step.length === args.length) {
        it(text, function () { return step.apply(void 0, args); });
    }
    else if (step.length === args.length + 1) {
        it(text, function (done) { return step.apply(void 0, args.concat([done])); });
    }
    else {
        throw new Error("Expected a step function with " + args.length + " or " + (args.length + 1) + " arguments (to match values \"" + args + "\") but got " + step);
    }
}
var Spec = /** @class */ (function () {
    // readonly fixtures: ISpecFixture[] = [];
    function Spec(description, onProcessOutcome) {
        this.onProcessOutcome = onProcessOutcome;
        this.steps = [];
        this.outcomes = [];
        this.description = description;
    }
    Spec.prototype.addStep = function (block, strings, step, args) {
        var text = strings.reduce(function (result, item, index) { return result + item + formatArg(args, index); }, '');
        this.steps.push(new Step(block, text, this.steps.length, function () { return step.apply(void 0, args); }, args, this));
    };
    Spec.prototype.given = function (strings) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return function (step) {
            _this.addStep(ScenarioBlock.Given, strings, step, args);
            return _this;
        };
    };
    Spec.prototype.when = function (strings) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return function (step) {
            _this.addStep(ScenarioBlock.When, strings, step, args);
            return _this;
        };
    };
    Spec.prototype.then = function (strings) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return function (step) {
            _this.addStep(ScenarioBlock.Then, strings, step, args);
            return _this;
        };
    };
    Spec.prototype.and = function (strings) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return function (step) {
            _this.addStep(ScenarioBlock.And, strings, step, args);
            return _this;
        };
    };
    Spec.prototype.execute = function (done) {
        this.runOutcomes();
        ConsoleOutcomePrinter.printOutcomes(this);
        done();
        // var thrower = CleanupAndGetThrower();
        // if (thrower != null) {
        // 	thrower.Throw();
        // }
    };
    Spec.prototype.runOutcomes = function () {
        var skip = false;
        // Fixtures.ForEach(x => x.SpecSetup(this));
        for (var _i = 0, _a = this.steps; _i < _a.length; _i++) {
            var step = _a[_i];
            step.willBeSkipped = skip;
            // Fixtures.ForEach(x => x.StepSetup(step));
            var o = this.processOutcome(step.execute(), step);
            // o = Fixtures.ForEach(x => x.StepOutcome(step));
            this.outcomes.push(o);
            skip = skip || o.causesSkip;
            // Fixtures.ForEach(x => x.StepTeardown(step));
        }
        // Fixtures.ForEach(x => x.SpecTeardown(this));
    };
    Spec.prototype.processOutcome = function (originalOutcome, step) {
        // Fixtures.for
        if (typeof this.onProcessOutcome === 'function') {
            return this.onProcessOutcome(originalOutcome, step);
        }
        return originalOutcome;
    };
    return Spec;
}());
// ConsoleOutcomePrinter
var Step = /** @class */ (function () {
    function Step(type, description, index, action, args, spec) {
        this.type = type;
        this.description = description;
        this.index = index;
        this.action = action;
        this.args = args;
        this.spec = spec;
        this.willBeSkipped = false;
    }
    Step.prototype.execute = function () {
        if (this.willBeSkipped) {
            return this.skip();
        }
        try {
            this.action();
            return this.pass();
        }
        catch (ex) {
            return this.error(ex);
        }
    };
    Object.defineProperty(Step.prototype, "formattedType", {
        get: function () {
            return padLeft(ScenarioBlock[this.type], maxStepOutcomeNameLength);
        },
        enumerable: true,
        configurable: true
    });
    Step.prototype.pass = function () {
        return new StepOutcome(this, Status.Passed);
    };
    Step.prototype.skip = function () {
        return new StepOutcome(this, Status.Skipped);
    };
    Step.prototype.error = function (e) {
        // how to do pending? 
        var outcome = new StepOutcome(this, Status.Failed);
        outcome.error = "" + e;
        return outcome;
    };
    return Step;
}());
var StepOutcome = /** @class */ (function () {
    function StepOutcome(step, status) {
        this.step = step;
        this.status = Status.NotRun;
        // TODO? 
        this.empty = false;
        this.status = status;
    }
    Object.defineProperty(StepOutcome.prototype, "causesSkip", {
        get: function () {
            return this.status === Status.Failed || this.status === Status.Pending;
        },
        enumerable: true,
        configurable: true
    });
    return StepOutcome;
}());
var ScenarioBlock;
(function (ScenarioBlock) {
    ScenarioBlock[ScenarioBlock["Given"] = 0] = "Given";
    ScenarioBlock[ScenarioBlock["When"] = 1] = "When";
    ScenarioBlock[ScenarioBlock["Then"] = 2] = "Then";
    ScenarioBlock[ScenarioBlock["And"] = 3] = "And";
})(ScenarioBlock || (ScenarioBlock = {}));
var Status;
(function (Status) {
    Status[Status["NotRun"] = 0] = "NotRun";
    Status[Status["Passed"] = 1] = "Passed";
    Status[Status["Skipped"] = 2] = "Skipped";
    Status[Status["Pending"] = 3] = "Pending";
    Status[Status["Failed"] = 4] = "Failed";
})(Status || (Status = {}));
var outcomes = Object.keys(Status).filter(function (x) { return typeof Status[x] === 'number'; });
var maxStepOutcomeNameLength = outcomes.reduce(function (acc, x) { return Math.max(acc, x.length); }, 0);
var ConsoleOutcomePrinter = /** @class */ (function () {
    function ConsoleOutcomePrinter() {
    }
    // const string Empty = " (Empty)";
    ConsoleOutcomePrinter.printOutcomes = function (spec) {
        console.log('> SpecLight results:');
        console.log();
        // if (spec.SpecTags.Any())
        // {
        // 	Console.WriteLine(String.Join(", ", spec.SpecTags.Select(x => "@" + x)));
        // }
        console.log(spec.description);
        console.log();
        // let specData = spec.DataDictionary.FormatExtraData();
        // if (!string.IsNullOrWhiteSpace(specData)) {
        // 	Console.WriteLine(specData);
        // 	Console.WriteLine();
        // }
        if (spec.outcomes.length === 0) {
            return;
        }
        // var maxMessageWidth = spec.outcomes.Max(x => x.Step.Description.Length + x.Step.FormattedType.Length) + 3;
        var maxMessageWidth = spec.outcomes.reduce(function (acc, x) {
            return Math.max(acc, x.step.description.length + x.step.formattedType.length);
        }, 0) + 3;
        for (var _i = 0, _a = spec.outcomes; _i < _a.length; _i++) {
            var o = _a[_i];
            var step = o.step;
            var message = step.formattedType + " " + step.description;
            var s = Status[o.status];
            // if (o.Empty) {
            // 	s += Empty;
            // }
            var cells = [
                padRight(message, maxMessageWidth),
                padRight(s, maxStepOutcomeNameLength + 1),
            ];
            console.log(cells.slice().join('\t'));
            // Console.WriteLine(string.Join('\t', cells.Where(x => x != null)));
        }
    };
    return ConsoleOutcomePrinter;
}());
function padLeft(str, len, ch) {
    if (ch === void 0) { ch = ' '; }
    var length = len - str.length + 1;
    return len > 0
        // tslint:disable-next-line:prefer-array-literal
        ? new Array(length).join(ch) + str
        : str;
}
function padRight(str, len, ch) {
    if (ch === void 0) { ch = ' '; }
    var length = len - str.length + 1;
    return len > 0
        // tslint:disable-next-line:prefer-array-literal
        ? str + new Array(length).join(ch)
        : str;
}
