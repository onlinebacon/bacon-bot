import EvalContext from './eval-context.js';
import EvalParser from './eval-parser.js';
import fillContext from './fill-context.js';
import TokenQueue from './token-queue.js';

const calc = (src, config = {}) => {
	const queue = new TokenQueue(src);
	const ctx = new EvalContext();
	Object.entries(config?.vars ?? {}).forEach((entry) => {
		const [ name, value ] = entry;
		ctx.addConstant(name, value);
	});
	Object.entries(config?.flags ?? {}).forEach((entry) => {
		const [ name, value ] = entry;
		ctx.flags[name] = value;
	});
	const parser = new EvalParser({ queue, context: ctx });
	fillContext(ctx);
	return parser.run();
};

export default calc;
