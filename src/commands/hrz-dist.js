import Commands from '../lib/commands/Commands.js';
import LengthUnits from '../lib/length-units/LengthUnits.js';

const meters = LengthUnits.use('meters');
const R = 6371008.8;

Commands.add({
	name: 'hrz-dist',
	listed: true,
	description: 'Calculates the ground distance to the geometrical horizon given the observer\'s height',
	syntax: '.hrz-dist HEIGHT',
	examples: [ '.hrz-dist 120000 ft' ],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 1) return this.handleBadSyntax(ctx, `Missing arguments`);
		if (args.length > 1) return this.handleBadSyntax(ctx, `Too many arguments`);
		const height = meters.parse(args[0]);
		if (isNaN(height)) return this.handleBadSyntax(ctx, `Invalid height value`);
		const radians = Math.acos(R/(R + height));
		const { lengthUnit } = ctx ?? LengthUnits;
		const distance = lengthUnit.fromMeters(radians*R);
		return ctx.msg.reply(`**Horizon distance**: ${lengthUnit.stringify(distance)}`);
	},
});
