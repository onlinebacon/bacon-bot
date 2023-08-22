import Commands from '../lib/commands/Commands.js';
import Constants from '../lib/constants/Constants.js';
import LengthUnits from '../lib/length-units/LengthUnits.js';
import Trig from '../lib/trig/trig.js';

const t = new Trig().useDegrees();
const meters = LengthUnits.use('meters');
const R = Constants.earthAverageRadius;
const calc = (h, d) => (
	t.sec(
		t.rad(d/R) - t.acos(R/(R + h))
	) - 1
)*R;

Commands.add({
	name: 'hid',
	listed: true,
	description: 'Calculates amount of height obstructed by geometric curvature after a specified distance',
	syntax: '.hid HEIGHT, DISTANCE',
	examples: [ '.hid 3 ft, 11 mi' ],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 2) return this.handleBadSyntax(ctx, `Missing arguments`);
		if (args.length > 2) return this.handleBadSyntax(ctx, `Too many arguments`);
		const [ height, distance ] = args.map(val => meters.parse(val));
		if (isNaN(height)) return this.handleBadSyntax(ctx, `Invalid height value`);
		if (isNaN(distance)) return this.handleBadSyntax(ctx, `Invalid distance value`);
		const { lengthUnit } = ctx;
		const res = calc(height, distance);
		return ctx.msg.reply(`**Hidden by the geometric curve**: ${lengthUnit.stringify(res)}`);
	},
});
