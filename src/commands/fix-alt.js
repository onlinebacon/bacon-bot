import DegParser from '../lib/angles/DegParser.js';
import calcAltRefraction from '../lib/celnav/calc-alt-refraction.js';
import calcDip from '../lib/celnav/calc-dip.js';
import Commands from '../lib/commands/Commands.js';
import LengthUnits from '../lib/length-units/LengthUnits.js';

const lengthUnits = LengthUnits.use('meters');
const fieldParser = {
	dip: (val) => lengthUnits.parse(val),
	index: (val) => DegParser.parse(val),
	ref: (val) => {
		if (val == null || /^(std|standard)$/i.test(val)) {
			return 'std';
		}
		return NaN;
	},
};

Commands.add({
	name: 'fix-alt',
	listed: true,
	description: 'Apply altitude corrections to an elevation angle measurement',
	syntax: '.fix-alt ANGLE [, CORRECTION]*',
	examples: [
		`.fix-alt 45° 12.3', dip: 15m, index: -2.5', ref`,
		`.fix-alt 22.375, dip: 12ft`,
	],
	argSep: ',',
	handler: async function({ ctx, args }) {

		const [ angleStr, ...configs ] = args;
		let angle = DegParser.parse(angleStr);
		if (isNaN(angle)) return this.handleBadSyntax(ctx);

		const config = {};
		for (let item of configs) {
			const [ name, value ] = item.split(':');
			const lowerName = name.toLowerCase();
			const parse = fieldParser[lowerName];
			if (!parse) return this.handleBadSyntax(ctx);
			const parsed = parse(value);
			if (typeof parsed === 'number' && isNaN(parsed)) {
				return this.handleBadSyntax(ctx, `Invalid value for ${name}`);
			}
			config[name] = parsed;
		}

		let text = 'Initial altitude: ' + ctx.degFormat.stringify(angle) + '\n';

		if (config.index != null) {
			const index = config.index;
			text += 'Index error: ' + ctx.degFormat.stringify(-index, ['+', '-']) + '\n';
			angle -= index;
		}

		if (config.dip != null) {
			const dip = calcDip(config.dip);
			text += 'Dip: ' + ctx.degFormat.stringify(-dip, ['+', '-']) + '\n';
			angle -= dip;
		}

		if (config.ref == 'std') {
			const ref = calcAltRefraction(angle);
			text += 'Refraction: ' + ctx.degFormat.stringify(-ref, ['+', '-']) + '\n';
			angle -= ref;
		}

		text += '**Altitude**: `' + ctx.degFormat.stringify(angle) + '`\n'; 
		text += '**Co-altitude**: `' + ctx.degFormat.stringify(90 - angle) + '`\n'; 
		return ctx.msg.reply(text);
	},
});
