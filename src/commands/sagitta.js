import Commands from '../lib/commands/Commands.js';
import Constants from '../lib/constants/Constants.js';
import LengthUnits from '../lib/length-units/LengthUnits.js';

const meters = LengthUnits.use('meters');
const R = Constants.earthAverageRadius;

Commands.add({
	name: 'sagitta',
	listed: true,
	description: 'Calculates the sagitta of an arc over the earth\'s surface given the arclength',
	syntax: '.sagitta ARCLENGTH',
	examples: [ '.sagitta 400m' ],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 1) return this.handleBadSyntax(ctx, `Missing arguments`);
		if (args.length > 1) return this.handleBadSyntax(ctx, `Too many arguments`);
		const distance = meters.parse(args[0]);
		if (isNaN(distance)) return this.handleBadSyntax(ctx, `Invalid distance value`);
		const { lengthUnit } = ctx;
		const radians = distance/R;
		const sagitta = (1 - Math.cos(radians/2))*R;
		return ctx.msg.reply(`**Sagitta**: ${lengthUnit.stringify(sagitta)}`);
	},
});
