import DegParser from '../lib/angles/DegParser.js';
import calcAltRefraction from '../lib/celnav/calc-alt-refraction.js';
import calcDip from '../lib/celnav/calc-dip.js';
import calcParallax from '../lib/celnav/calc-parallax.js';
import Commands from '../lib/commands/Commands.js';
import LengthUnits from '../lib/length-units/LengthUnits.js';

const lengthUnits = LengthUnits.use('meters');
const fieldParser = {
	parallax: (val) => {
		val = val.trim().toLowerCase();
		if (val === 'moon') return 3.844e8;
		return lengthUnits.parse(val);
	},
	dip: (val) => lengthUnits.parse(val),
	index: (val) => DegParser.parse(val),
	ref: (val) => {
		if (val == null || /^(std|standard)$/i.test(val)) {
			return { pMb: 1010, tempC: 10 };
		}
		const res = parseRefInput(val);
		if (res.error) {
			return NaN;
		}
		return res;
	},
};

const farenheitToCelcius = (f) => (f - 32)*5/9;

const numberToken = /^([-+]\s*)?\d+(\.\d+)?/;
const unitToken = /^[a-z]+/i;
const parseRefInput = (str) => {
	str = str.trim();
	const arr = [ numberToken, unitToken, numberToken, unitToken ];
	const vals = [];
	const errorMessage = 'Invalid input for temperature and pressure';
	const errorObj = { error: true, message: errorMessage };
	for (const regex of arr) {
		let item = str.match(regex)?.[0] ?? null;
		if (item == null) break;
		vals.push(item);
		str = str.replace(regex, '').trim();
	}
	if (str !== '' || vals.length !== 2 && vals.length !== 4) {
		return errorObj;
	}
	let pMb = 1010, tempC = 10;
	for (let i=0; i<vals.length; i+=2) {
		let val = Number(vals[i]);
		console.log({ val });
		if (isNaN(val)) {
			return errorObj;	
		}
		let unit = vals[i + 1].toLowerCase();
		console.log({ unit });
		switch (unit) {
		case 'f':
			tempC = farenheitToCelcius(val);
			break;
		case 'c':
			tempC = val;
			break;
		case 'mb':
			pMb = val;
			break;
		default:
			return errorObj;	
		}
	}
	return { error: false, pMb, tempC };
};

Commands.add({
	name: 'fix-alt',
	listed: true,
	description: 'Apply altitude corrections to an elevation angle measurement',
	syntax: '.fix-alt ANGLE [, CORRECTION]*',
	examples: [
		`.fix-alt 45° 12.3', dip: 15m, index: -2.5', ref: 1005 mb 12 C`,
		`.fix-alt 22.375, dip: 12ft, ref: 75F`,
		`.fix-alt 32, ref, parallax: moon`,
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

		if (config.ref != null) {
			const { pMb, tempC } = config.ref;
			const ref = calcAltRefraction(angle, pMb, tempC);
			text += 'Refraction: ' + ctx.degFormat.stringify(-ref, ['+', '-']) + '\n';
			angle -= ref;
		}

		if (config.parallax != null) {
			const dist = config.parallax;
			const c = calcParallax(angle, dist);
			text += 'Parallax: ' + ctx.degFormat.stringify(c, ['+', '-']) + '\n';
			angle += c;
		}

		text += '**Altitude**: `' + ctx.degFormat.stringify(angle) + '`\n'; 
		text += '**Co-altitude**: `' + ctx.degFormat.stringify(90 - angle) + '`\n'; 
		return ctx.msg.reply(text);
	},
});
