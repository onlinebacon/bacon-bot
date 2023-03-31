import Commands from '../lib/commands/Commands.js';
import LengthUnits from '../lib/length-units/LengthUnits.js';

const meters = LengthUnits.use('meters');
const R = 6371008.8;

Commands.add({
	name: 'drop',
	listed: true,
	description: 'Calculates amount of drop from a horizontal line going straight to the surface given a ground distance',
	syntax: '.drop DISTANCE',
	examples: [ '.drop 2 mi' ],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 1) return this.handleBadSyntax(ctx, `Missing arguments`);
		if (args.length > 1) return this.handleBadSyntax(ctx, `Too many arguments`);
		const distance = meters.parse(args[0]);
		if (isNaN(distance)) return this.handleBadSyntax(ctx, `Invalid distance value`);
		const { lengthUnit } = ctx;
		const radians = distance/R;
		const drop = (1/Math.cos(radians) - 1)*R;
		return ctx.msg.reply(`**Drop**: ${lengthUnit.stringify(drop)}`);
	},
});
