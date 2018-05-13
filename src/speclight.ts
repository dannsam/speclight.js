export interface BddTemplateTagFunction {
	(strings: TemplateStringsArray):
		(step: (done: DoneFn) => void) => void;
	<T1>(strings: TemplateStringsArray, a1: T1):
		(step: (a1: T1, done: DoneFn) => void) => void;
	<T1, T2>(strings: TemplateStringsArray, a1: T1, a2: T2):
		(step: (a1: T1, a2: T2, done: DoneFn) => void) => void;
	<T1, T2, T3>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3):
		(step: (a1: T1, a2: T2, a3: T3, done: DoneFn) => void) => void;
	<T1, T2, T3, T4>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3, a4: T4):
		(step: (a1: T1, a2: T2, a3: T3, a4: T4, done: DoneFn) => void) => void;
	<T1, T2, T3, T4, T5>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3, a4: T4, a5: T5):
		(step: (a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, done: DoneFn) => void) => void;
	<T1, T2, T3, T4, T5, T6>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6):
		(step: (a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6, done: DoneFn) => void) => void;
	<T1, T2, T3, T4, T5, T6, T7>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6, a7: T7):
		(step: (a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6, a7: T7, done: DoneFn) => void) => void;
	<T1, T2, T3, T4, T5, T6, T7, T8>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6, a7: T7, a8: T8):
		(step: (a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6, a7: T7, a8: T8, done: DoneFn) => void) => void;
}

export const given: BddTemplateTagFunction = function (strings: TemplateStringsArray, ...args: any[]) {
	return (step: Function) => {
		bddIt('Given', strings, args, step);
	};
};

export const when: BddTemplateTagFunction = function (strings: TemplateStringsArray, ...args: any[]) {
	return (step: Function) => {
		bddIt('When', strings, args, step);
	};
};

export const then: BddTemplateTagFunction = function (strings: TemplateStringsArray, ...args: any[]) {
	return (step: Function) => {
		bddIt('Then', strings, args, step);
	};
};

export const and: BddTemplateTagFunction = function (strings: TemplateStringsArray, ...args: any[]) {
	return (step: Function) => {
		bddIt(' And', strings, args, step);
	};
};

function formatArg(args: object[], i: number) {
	if (i >= args.length) {
		return '';
	}
	const a = args[i];
	switch (typeof a) {
		case 'string': return `"${a}"`;
	}

	return a.toString();
}

export function spec(description: string, definition: (spec: ISpec) => void): void {
	debugger;
	const s: jasmine.Spec = it(description, (done) => {
		const spec = new Spec(description, onProcessOutcome);
		definition(spec);

		spec.execute(done);
	}) as any;

	const expectations: { passed: boolean, result: jasmine.ExpectationResult }[] = [];
	const originalAddExpectationResult = (s as any).addExpectationResult;
	(s as any).addExpectationResult = function (passed: boolean, result: jasmine.ExpectationResult) {
		expectations.push({ passed, result });
	};

	const onProcessOutcome = (original: StepOutcome, step: Step): StepOutcome => {
		const result = s.getResult();
		let outcome = original;

		if (original.status === Status.Passed) {
			const failedExpectations = expectations.filter(x => !x.passed);
			if (failedExpectations.length) {
				// report failed expectations
				outcome = new StepOutcome(step, Status.Failed);
				outcome.error = failedExpectations.map(x => x.result.message).join('\n') as string;

				failedExpectations.forEach((x) => {
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
			// expect()
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

function bddIt(stepType: string, strings: TemplateStringsArray, args: any[], step: Function) {
	const text = `${stepType} ${strings.reduce((result, item, index) => result + item + formatArg(args, index), '')}`;
	if (step.length === args.length) {
		it(text, () => step(...args));
	} else if (step.length === args.length + 1) {
		it(text, done => step(...args, done));
	} else {
		throw new Error(`Expected a step function with ${args.length} or ${args.length + 1} arguments (to match values "${args}") but got ${step}`);
	}
}

interface ISpec {
	given: BddTemplateFunction;
	when: BddTemplateFunction;
	then: BddTemplateFunction;
	and: BddTemplateFunction;
}

class Spec implements ISpec {
	readonly description: string;
	readonly steps: Step[] = [];
	readonly outcomes: StepOutcome[] = [];
	// readonly fixtures: ISpecFixture[] = [];

	constructor(description: string, private onProcessOutcome?: (o: StepOutcome, step: Step) => StepOutcome) {
		this.description = description;
	}

	addStep(block: ScenarioBlock, strings: TemplateStringsArray, step: Function, args: any[]): void {
		const text = strings.reduce((result, item, index) => result + item + formatArg(args, index), '');

		this.steps.push(new Step(
			block,
			text,
			this.steps.length,
			() => step(...args),
			args,
			this,
		));
	}

	given(strings: TemplateStringsArray, ...args: any[]): any {
		return (step: Function) => {
			this.addStep(ScenarioBlock.Given, strings, step, args);
			return this;
		};
	}

	when(strings: TemplateStringsArray, ...args: any[]): any {
		return (step: Function) => {
			this.addStep(ScenarioBlock.When, strings, step, args);
			return this;
		};
	}

	then(strings: TemplateStringsArray, ...args: any[]): any {
		return (step: Function) => {
			this.addStep(ScenarioBlock.Then, strings, step, args);
			return this;
		};
	}

	and(strings: TemplateStringsArray, ...args: any[]): any {
		return (step: Function) => {
			this.addStep(ScenarioBlock.And, strings, step, args);
			return this;
		};
	}

	execute(done: DoneFn) {
		this.runOutcomes();

		ConsoleOutcomePrinter.printOutcomes(this);
		done();
		// var thrower = CleanupAndGetThrower();
		// if (thrower != null) {
		// 	thrower.Throw();
		// }
	}

	runOutcomes() {
		let skip = false;

		// Fixtures.ForEach(x => x.SpecSetup(this));
		for (const step of this.steps) {
			step.willBeSkipped = skip;
			// Fixtures.ForEach(x => x.StepSetup(step));
			const o = this.processOutcome(step.execute(), step);
			// o = Fixtures.ForEach(x => x.StepOutcome(step));
			this.outcomes.push(o);
			skip = skip || o.causesSkip;
			// Fixtures.ForEach(x => x.StepTeardown(step));
		}
		// Fixtures.ForEach(x => x.SpecTeardown(this));
	}

	processOutcome(originalOutcome: StepOutcome, step: Step): StepOutcome {
		// Fixtures.for
		if (typeof this.onProcessOutcome === 'function') {
			return this.onProcessOutcome(originalOutcome, step);
		}
		return originalOutcome;
	}
}

// ConsoleOutcomePrinter

class Step {
	willBeSkipped = false;

	constructor(
		public readonly type: ScenarioBlock,
		public readonly description: string,
		public readonly index: number,
		public readonly action: Function,
		public readonly args: any[],
		public readonly spec: ISpec) {
	}

	execute(): StepOutcome {
		if (this.willBeSkipped) {
			return this.skip();
		}

		try {
			this.action();
			return this.pass();
		} catch (ex) {
			return this.error(ex);
		}
	}

	get formattedType() {
		return padLeft(ScenarioBlock[this.type], maxStepOutcomeNameLength);
	}

	private pass() {
		return new StepOutcome(this, Status.Passed);
	}

	private skip() {
		return new StepOutcome(this, Status.Skipped);
	}

	private error(e: Error) {
		// how to do pending? 
		const outcome = new StepOutcome(this, Status.Failed);
		outcome.error = `${e}`;

		return outcome;
	}
}

class StepOutcome {
	readonly status: Status = Status.NotRun;
	// TODO? 
	empty = false;
	error: string | undefined;

	get causesSkip() {
		return this.status === Status.Failed || this.status === Status.Pending;
	}

	constructor(public readonly step: Step, status: Status) {
		this.status = status;
	}
}

enum ScenarioBlock {
	Given,
	When,
	Then,
	And,
}

enum Status {
	NotRun,
	Passed,
	Skipped,
	Pending,
	Failed,
}

const outcomes = Object.keys(Status).filter((x: any) => typeof Status[x] === 'number');
const maxStepOutcomeNameLength = outcomes.reduce((acc, x) => Math.max(acc, x.length), 0);

export interface BddTemplateFunction {
	(strings: TemplateStringsArray):
		(step: () => void) => ISpec;
	<T1>(strings: TemplateStringsArray, a1: T1):
		(step: (a1: T1) => void) => ISpec;
	<T1, T2>(strings: TemplateStringsArray, a1: T1, a2: T2):
		(step: (a1: T1, a2: T2) => void) => ISpec;
	<T1, T2, T3>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3):
		(step: (a1: T1, a2: T2, a3: T3) => void) => ISpec;
	<T1, T2, T3, T4>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3, a4: T4):
		(step: (a1: T1, a2: T2, a3: T3, a4: T4) => void) => ISpec;
	<T1, T2, T3, T4, T5>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3, a4: T4, a5: T5):
		(step: (a1: T1, a2: T2, a3: T3, a4: T4, a5: T5) => void) => ISpec;
	<T1, T2, T3, T4, T5, T6>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6):
		(step: (a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6) => void) => ISpec;
	<T1, T2, T3, T4, T5, T6, T7>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6, a7: T7):
		(step: (a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6, a7: T7) => void) => ISpec;
	<T1, T2, T3, T4, T5, T6, T7, T8>(strings: TemplateStringsArray, a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6, a7: T7, a8: T8):
		(step: (a1: T1, a2: T2, a3: T3, a4: T4, a5: T5, a6: T6, a7: T7, a8: T8) => void) => ISpec;
}

class ConsoleOutcomePrinter {
	// const string Empty = " (Empty)";

	static printOutcomes(spec: Spec): void {
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
		const maxMessageWidth = spec.outcomes.reduce(
			(acc, x) => {
				return Math.max(acc, x.step.description.length + x.step.formattedType.length);
			},
			0) + 3;

		for (const o of spec.outcomes) {
			const step = o.step;
			const message = `${step.formattedType} ${step.description}`;
			const s = Status[o.status];
			// if (o.Empty) {
			// 	s += Empty;
			// }
			const cells = [
				padRight(message, maxMessageWidth),
				padRight(s, maxStepOutcomeNameLength + 1),
				// string.Join(', ', step.Tags.Select(x => '@' + x)),
				// step.DataDictionary.FormatExtraData();
			];
			console.log([...cells].join('\t'));
			// Console.WriteLine(string.Join('\t', cells.Where(x => x != null)));
		}
	}
}

function padLeft(str: string, len: number, ch: string = ' '): string {
	const length = len - str.length + 1;
	return len > 0
		// tslint:disable-next-line:prefer-array-literal
		? new Array(length).join(ch) + str
		: str;
}

function padRight(str: string, len: number, ch: string = ' '): string {
	const length = len - str.length + 1;
	return len > 0
		// tslint:disable-next-line:prefer-array-literal
		? str + new Array(length).join(ch)
		: str;
}
