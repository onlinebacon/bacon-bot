import DegParser from '../lib/angles/DegParser.js';
import Commands from '../lib/commands/Commands.js';
import trilaterate from '../lib/sphere/trilaterate.js';
import { arrayGroup } from '../lib/utils.js';

Commands.add({
	name: 'trilaterate',
	listed: true,
	description: 'Solves for the intersection of three or more circles of equal altitude',
	syntax: '.trilaterate LAT_1, LON_1, RAD_1, LAT_2, LON_2, RAD_2...',
	examples: [],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 9) return this.handleBadSyntax(ctx, 'Missing arguments');
		if (args.length % 3 !== 0) return this.handleBadSyntax(ctx, 'Wrong number of arguments');
		const parsed = args.map(str => DegParser.parse(str));
		if (parsed.find(val => isNaN(val)) != null) {
			return this.handleBadSyntax(ctx);
		}
		const radians = parsed.map(val => val/180*Math.PI);
		const circles = arrayGroup(radians, 3).map(group => {
			const [ lat, lon, radius ] = group;
			const center = [ lat, lon ];
			return { center, radius };
		});
		const [ lat, lon ] = trilaterate(circles).coord.map(val => val/Math.PI*180);
		const strLat = ctx.latLon.stringifyLat(lat);
		const strLon = ctx.latLon.stringifyLon(lon);
		const text = `**Result**: \`${strLat}\`, \`${strLon}\``;
		return ctx.msg.reply(`${text}`);
	},
});
