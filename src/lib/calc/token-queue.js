import { CompilationError } from './errors.js';

export default class TokenQueue {
	constructor(src) {
		this.remain = src;
		this.length = src.length;
		this.skipSpaces();
	}
	get index() {
		return this.length - this.remain.length;
	}
	skipSpaces() {
		this.remain = this.remain.replace(/^\s+/, '');
		return this;
	}
	match(pattern) {
		if (pattern instanceof RegExp) {
			const [ match ] = this.remain.match(pattern) ?? [ null ];
			return match;
		}
		const { length } = pattern;
		const top = this.remain.substring(0, length);
		if (top !== pattern) return null;
		return top;
	}
	popIf(pattern) {
		const match = this.match(pattern);
		if (match === null) return null;
		this.remain = this.remain.substring(match.length);
		this.skipSpaces();
		return match;
	}
	pop(pattern) {
		const match = this.popIf(pattern);
		if (match === null) {
			throw new CompilationError('Compilation error', this.index);
		}
		return match;
	}
}
