import DegParser from '../lib/angles/DegParser.js';
import Commands from '../lib/commands/Commands.js';
import Constants from '../lib/constants/Constants.js';
import LengthUnits from '../lib/length-units/LengthUnits.js';
import haversine from '../lib/sphere/haversine.js';

Commands.add({
	name: 'hav',
	listed: true,
	description: 'Gets the distance between two coordinates',
	syntax: '.hav LAT_1, LON_1, LAT_2, LON_2',
	examples: [
		'.hav 19.065, -53.984, 11.859, -111.654',
	],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 4) return this.handleBadSyntax(ctx, 'Missing arguments');
		if (args.length > 4) return this.handleBadSyntax(ctx, 'Too many arguments');
		const parsed = args.map(str => DegParser.parse(str));
		if (parsed.find(val => isNaN(val)) != null) {
			return this.handleBadSyntax(ctx);
		}
		const radArgs = parsed.map(val => val/180*Math.PI);
		const [ lat1, lon1, lat2, lon2 ] = radArgs;
		const radians = haversine([ lat1, lon1 ], [ lat2, lon2 ]);
		const degrees = radians/Math.PI*180;
		const distance = radians*Constants.earthAverageRadius;
		const { lengthUnit } = ctx ?? LengthUnits;
		let text = '';
		text += `*Degrees*: **${ctx.degFormat.stringify(degrees)}**\n`;
		text += `*Distance*: **${lengthUnit.stringify(distance)}**\n`;
		return ctx.msg.reply(text);
	},
});
