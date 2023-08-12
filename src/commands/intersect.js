import DegParser from '../lib/angles/DegParser.js';
import Commands from '../lib/commands/Commands.js';
import haversine from '../lib/sphere/haversine.js';
import calcTwoCirclesIntersections from '../lib/sphere/calc-two-circles-intersection.js';

const circlesIntersect = (aLat, aLon, aRad, bLat, bLon, bRad) => {
	const dist = haversine([ aLat, aLon ], [ bLat, bLon ]);
	if (dist > aRad + bRad) {
		return false;
	}
	if (dist < Math.abs(aRad - bRad)) {
		return false;
	}
	return true;
};

Commands.add({
	name: 'intersect',
	listed: true,
	description: 'Gets intersection between two circles of equal altitude',
	syntax: '.intersect LAT_1, LON_1, RAD_1, LAT_2, LON_2, RAD_2',
	examples: [
		'.intersect 19.065, -53.984, 41.341, 11.859, -111.654, 36.597',
		`.intersect 19°3.9'N, 53°59'W, 41°20.5', 11°51.5'N, 111°39.2'W, 36°35.8'`,
	],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 6) return this.handleBadSyntax(ctx, 'Missing arguments');
		if (args.length > 6) return this.handleBadSyntax(ctx, 'Too many arguments');
		const parsed = args.map(str => DegParser.parse(str));
		if (parsed.find(val => isNaN(val)) != null) {
			return this.handleBadSyntax(ctx);
		}
		const radians = parsed.map(val => val/180*Math.PI);
		if (!circlesIntersect(...radians)) {
			return ctx.msg.reply(`The circles provided do not intersect`);
		}
		const res = calcTwoCirclesIntersections(...radians).map(coord => {
			const [ lat, lon ] = coord.map(val => val/Math.PI*180);
			const strLat = ctx.latLon.stringifyLat(lat);
			const strLon = ctx.latLon.stringifyLon(lon);
			return `**${strLat}**, **${strLon}**`;
		});
		const text = 'The circles intersect at the coordinates ' + res.join(' and ');
		return ctx.msg.reply(`${text}`);
	},
});
