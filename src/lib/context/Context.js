import DegTrig from '../trig/DegTrig.js';
import RadTrig from '../trig/RadTrig.js';

const flagHandlers = {
	'deg': (ctx) => ctx.trig = DegTrig,
	'rad': (ctx) => ctx.trig = RadTrig,
};

export default class Context {
	constructor({ msg }) {
		this.msg = msg;
		this.trig = DegTrig;
	}
	knownFlag(flag) {
		const handler = flagHandlers[flag];
		return handler !== undefined;
	}
	applyFlag(flag) {
		flagHandlers[flag]?.(this);
		return this;
	}
}
