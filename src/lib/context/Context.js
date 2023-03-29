import DegFormats from '../angles/DegFormats.js';
import LengthUnits from '../length-units/LengthUnits.js';
import DegTrig from '../trig/DegTrig.js';
import RadTrig from '../trig/RadTrig.js';

const flagHandlers = {
	'deg': (ctx) => ctx.trig = DegTrig,
	'rad': (ctx) => ctx.trig = RadTrig,
	
	'ang:min': (ctx) => ctx.degFormat = ctx.degFormat.arcMins(),
	'ang:sec': (ctx) => ctx.degFormat = ctx.degFormat.arcSecs(),
	'ang:dec': (ctx) => ctx.degFormat = ctx.degFormat.decimal(),

	'miles':  (ctx) => ctx.lengthUnit = ctx.lengthUnit.use('miles'),
	'km':     (ctx) => ctx.lengthUnit = ctx.lengthUnit.use('km'),
	'meters': (ctx) => ctx.lengthUnit = ctx.lengthUnit.use('meters'),
	'imp':    (ctx) => ctx.lengthUnit = ctx.lengthUnit.imperial(),
	'metric': (ctx) => ctx.lengthUnit = ctx.lengthUnit.metric(),
};

export default class Context {
	constructor({ msg }) {
		this.msg = msg;
		this.trig = DegTrig;
		this.degFormat = DegFormats;
		this.lengthUnit = LengthUnits;
	}
	flagIsKnown(flag) {
		const handler = flagHandlers[flag];
		return handler !== undefined;
	}
	applyFlag(flag) {
		flagHandlers[flag]?.(this);
		return this;
	}
}
