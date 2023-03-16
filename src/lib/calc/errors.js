export class CompilationError extends Error {
	constructor(message, index) {
		const pos = index + 1;
		super(message + ' at position ' + pos);
		this.index = index;
	}
}
