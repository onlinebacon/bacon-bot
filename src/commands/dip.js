import Commands from '../lib/commands/Commands.js';
import Constants from '../lib/constants/Constants.js';
import LengthUnits from '../lib/length-units/LengthUnits.js';

const meters = LengthUnits.use('meters');
const r = 7/6*Constants.earthAverageRadius;

Commands.add({
	name: 'dip',
	listed: true,
	description: 'Calculates dip angle using the geometrical formula for a 7/6 mile radius earth',
	syntax: '.dip HEIGHT',
	argSep: ',',
	examples: [
		'.dip 23 ft',
		'.dip 50 m',
	],
	handler: async function({ ctx, args }) {
		if (args.length < 1) return this.handleBadSyntax(ctx, 'Missing arguments');
		if (args.length > 1) return this.handleBadSyntax(ctx, 'Too many arguments');
		const [ height ] = args;
		const h = meters.parse(height);
		if (isNaN(h)) return this.handleBadSyntax(ctx, 'Invalid height');
		const dip = Math.acos(r/(r + h));
		const dipDegrees = dip/Math.PI*180;
		return ctx.msg.reply(`**Dip**: ${ctx.degFormat.stringify(dipDegrees)}`);
	},
});
