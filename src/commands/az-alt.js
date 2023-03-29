import Commands from '../lib/commands/Commands.js';
import DegParser from '../lib/angles/DegParser.js';
import calcAzAlt from '../lib/sphere/calc-az-alt.js';

const degToRad = (deg) => deg/180*Math.PI;
const radToDeg = (rad) => rad/Math.PI*180;

Commands.add({
	name: 'az-alt',
	listed: true,
	description: 'Get azimuth and altitude from an observer at a certain ground position to a target at another ground position',
	syntax: '.az-alt OBSERVER_LAT, OBSERVER_LON, TARGET_LAT, TARGET_LON [, TARGET_HEIGHT]',
	examples: [],
	argSep: ',',
	handler: async function({ ctx, args }) {
		const parsed = args.map((val, i) => {
			if (i < 4) {
				const deg = DegParser.parse(val);
				console.log({ val, deg });
				return degToRad(deg);
			}
			return ctx.lengthUnit.parse(val);
		});
		if (parsed.find(val => isNaN(val)) != null) {
			return this.handleBadSyntax(ctx);
		}
		const earthRadius = ctx.lengthUnit.parse('6371.0088km');
		const [ aLat, aLon, bLat, bLon, height = Infinity ] = parsed;
		const ratio = earthRadius/height;
		console.log({ earthRadius, height, ratio });
		const [ az, alt ] = calcAzAlt([ aLat, aLon ], [ bLat, bLon ], ratio).map(radToDeg);
		const message = `**Azimuth**: \`${ctx.degFormat.stringify(az)}\`\n`
			+ `**Altitude**: \`${ctx.degFormat.stringify(alt)}\``;
		return ctx.msg.reply(message);
	},
});
