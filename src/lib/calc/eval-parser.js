import { CompilationError } from './errors.js';
import EvalContext from './eval-context.js';
import TokenQueue from './token-queue.js';

const TOKEN = {
	word: /^[a-z]\w*/i,
	number: /^\d+(\.\d+)?(e[-+]?\d+)?/i,
	plus_minus: /^[\-+]/,
	mul_div: /^[*\/]/,
};

export default class EvalParser {
	constructor({
		queue = new TokenQueue(),
		context = new EvalContext(),
	}) {
		this.queue = queue;
		this.context = context;
	}
	parseArgs() {
		const { queue } = this;
		const args = [];
		queue.pop('(');
		if (queue.popIf(')') !== null) {
			return args;
		}
		for (;;) {
			args.push(this.parseExpr());
			if (queue.popIf(',') === null) break;
		}
		queue.pop(')');
		return args;
	}
	parseCall(fn) {
		const { context, queue } = this;
		const { index } = queue;
		const args = this.parseArgs();
		if (args.length !== fn.argc) {
			let message = 'Incorrect number of arguments, ' +
				`expected ${fn.argc} but found ${args.length}`;
			throw new CompilationError(message, index);
		}
		return fn.call(context, ...args);
	}
	parseItem() {
		const { queue, context } = this;
		const number = queue.popIf(TOKEN.number);
		if (number !== null) {
			return Number(number);
		}
		if (queue.popIf('(') !== null) {
			const content = this.parseExpr();
			queue.pop(')');
			return content;
		}
		const word = queue.popIf(TOKEN.word);
		if (word === null) {
			throw new CompilationError('Syntax error', queue.index);
		}
		const value = context.getValue(word);
		if (value !== null) return value;
		const fn = context.getFunction(word);
		if (fn === null) {
			throw new CompilationError(`Unrecognized identifier '${word}'`, queue.index);
		}
		return this.parseCall(fn);
	}
	parsePow() {
		const { queue } = this;
		let pow = this.parseItem();
		for (;;) {
			const op = queue.popIf('^');
			if (op === null) break;
			const item = this.parseItem();
			pow = Math.pow(pow, item);
		}
		return pow;
	}
	parseMul() {
		const { queue } = this;
		let mul = this.parsePow();
		for (;;) {
			const op = queue.popIf(TOKEN.mul_div);
			if (op === null) break;
			const item = this.parsePow();
			if (op === '*') {
				mul *= item;
			} else {
				mul /= item;
			}
		}
		return mul;
	}
	parseSum() {
		const { queue } = this;
		let sum = this.parseMul();
		for (;;) {
			const op = queue.popIf(TOKEN.plus_minus);
			if (op === null) break;
			const item = this.parseMul();
			if (op === '+') {
				sum += item;
			} else {
				sum -= item;
			}
		}
		return sum;
	}
	parseExpr() {
		return this.parseSum();
	}
	run() {
		return this.parseExpr();
	}
}
