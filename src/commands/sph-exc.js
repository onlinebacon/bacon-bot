import Commands from '../lib/commands/Commands.js';
import calcSphericalExcess from '../lib/sphere/calc-spherical-excess.js';
import LengthUnits from '../lib/length-units/LengthUnits.js';

const EARTH_RADIUS = 6371008.8;
const lengthUnits = LengthUnits.use('meters');

Commands.add({
	name: 'sph-exc',
	listed: true,
	description: 'Finds the expected spherical excess given three side lengths',
	syntax: '.sph-exc SIDELENGTH1, SIDELENGTH2, SIDELENGTH3',
	examples: [
		'.sph-exc 134.3 km, 201.7 km, 187.7 km',
	],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 3) return this.handleBadSyntax(ctx, 'Missing arguments');
		if (args.length > 3) return this.handleBadSyntax(ctx, 'Too many arguments');
		const parsed = args.map((str) => lengthUnits.parse(str)/EARTH_RADIUS);
		if (parsed.find(val => isNaN(val)) != null) return this.handleBadSyntax(ctx);
		const [ a, b, c ] = parsed;
		const radians = calcSphericalExcess(a, b, c);
		const degrees = radians/Math.PI*180;
		return ctx.msg.reply(`**Spherical excess**: ${ctx.degFormat.stringify(degrees)}`);
	},
});
