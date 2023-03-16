import EvalContext from './eval-context.js';

const { PI, exp, log, sin, cos, tan, asin, acos, atan } = Math;
const toRad = (deg) => deg*(PI/180);
const toDeg = (rad) => rad*(180/PI);

const lengthUnits = {
	'mm': 0.001,
	'cm': 0.01,
	'in': 0.0254,
	'ft': 0.3048,
	'm':  1,
	'km': 1000,
	'mi': 1609.344,
	'nm': 1852,
	'r':  6371008.8,
	'ly': 299792458*365.25*24*60*60,
};

const addUnits = (ctx) => {
	for (const name in lengthUnits) {
		const value = lengthUnits[name];
		ctx.addGetter(name, ({ flags: { length_unit = 1 } }) => value/length_unit);
	}
};

const fillContext = (ctx = new EvalContext()) => {
	ctx.addConstant('pi', Math.PI);
	ctx.addFunction('sin', 1, (ctx, angle) => {
		return ctx.flags.radians ? sin(angle) : sin(toRad(angle));
	});
	ctx.addFunction('cos', 1, (ctx, angle) => {
		return ctx.flags.radians ? cos(angle) : cos(toRad(angle));
	});
	ctx.addFunction('tan', 1, (ctx, angle) => {
		return ctx.flags.radians ? tan(angle) : tan(toRad(angle));
	});
	ctx.addFunction('asin', 1, (ctx, ratio) => {
		return ctx.flags.radians ? asin(ratio) : toDeg(asin(ratio));
	});
	ctx.addFunction('acos', 1, (ctx, ratio) => {
		return ctx.flags.radians ? acos(ratio) : toDeg(acos(ratio));
	});
	ctx.addFunction('atan', 1, (ctx, ratio) => {
		return ctx.flags.radians ? atan(ratio) : toDeg(atan(ratio));
	});
	ctx.addFunction('exp', 1, (_, val) => exp(val));
	ctx.addFunction('ln', 1, (_, val) => log(val));
	addUnits(ctx);
};

export default fillContext;
