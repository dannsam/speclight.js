import { spec, given, when, then, and } from '../src/speclight';

// let firstRun = true;

describe('examples', () => {
	spec(
		`In order to know how much money I can save
As a Math Idiot
I want to add two numbers`,
		(spec) => {
			let a: number;
			let b: number;
			let actual: number;

			spec
				.given`I enter ${5}`(input => a = input)
				.and`I enter ${6}`(input => b = input)
				.when`I press add`(() => actual = add(a, b))
				.then`The result should be ${12}`(expected => expect(expected).toBe(actual));
		});

	fdescribe('skipping', () => {
		spec(
			`In order to know how much money I can save
	As a Math Idiot
	I want to add two numbers`,
			(spec) => {
				let a: number;
				let b: number;
				let actual: number;

				spec
					.given`I enter ${5}`(input => a = input)
					.and`I enter ${6}`(input => b = input)
					.when`I press add`(() => actual = add(a, b))
					.then`The result should be ${11}`(expected => expect(expected).toBe(actual))
					.and`The result should be ${1000}`(expected => expect(expected).toBe(actual))
					.and`This step should not be executed`(() => fail('should not be executed'));
			});
	});
});

function add(a: number, b: number) {
	return a + b;
}
