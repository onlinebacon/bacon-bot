import DegParser from '../lib/angles/DegParser.js';
import calcAltRefraction from '../lib/celnav/calc-alt-refraction.js';
import calcDip from '../lib/celnav/calc-dip.js';
import Commands from '../lib/commands/Commands.js';
import LengthUnits from '../lib/length-units/LengthUnits.js';
import * as LimbCorrection from '../lib/celnav/limb-correction.js';
import Constants from '../lib/constants/Constants.js';
import calcParallax from '../lib/celnav/calc-parallax.js';

const UPPER_LIMB = 'upper-limb';
const LOWER_LIMB = 'lower-limb';
const limbRegex = /\b(lower|upper)-limb\b/i;
const parseSunMoonField = (val = '', defDist) => {
	val = val.trim();
	let limb = null;
	let distance = defDist;
	if (limbRegex.test(val)) {
		limb = val.match(limbRegex)[0].toLowerCase();
		val = val.replace(limbRegex, '').trim();
	}
	if (val !== '') {
		distance = LengthUnits.parse(val);
	}
	if (isNaN(distance)) {
		return NaN;
	}
	return { limb, distance };
};

const lengthUnits = LengthUnits.use('meters');
const fieldParser = {
	moon: (val) => {
		return parseSunMoonField(val, Constants.earthMoonAverageDistance);
	},
	sun: (val) => {
		return parseSunMoonField(val, Constants.earthSunAverageDistance);
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
		if (isNaN(val)) {
			return errorObj;	
		}
		let unit = vals[i + 1].toLowerCase();
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
		`.fix-alt 23.45, moon: 375412 km lower-limb`,
		`.fix-alt 61° 15', sun: upper-limb`,
		`.fix-alt 47.2, sun: lower-limb 151023974 km`,
	],
	argSep: ',',
	handler: async function({ ctx, args }) {

		const [ angleStr, ...configs ] = args;
		let alt = DegParser.parse(angleStr);
		if (isNaN(alt)) return this.handleBadSyntax(ctx);

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

		let text = 'Initial altitude: ' + ctx.degFormat.stringify(alt) + '\n';

		const addCorrection = (name, angle) => {
			text += `${name}: ${ctx.degFormat.stringify(angle, ['+', '-'])}\n`;
			alt += angle;
		};

		if (config.index != null) {
			const index = config.index;
			addCorrection('Index error', -index);
		}

		if (config.dip != null) {
			const dip = calcDip(config.dip);
			addCorrection('Dip', -dip);
		}

		if (config.ref != null) {
			const { pMb, tempC } = config.ref;
			const ref = calcAltRefraction(alt, pMb, tempC);
			addCorrection('Refraction', -ref);
		}

		const moonSunCorrection = (arg, radius) => {
			const { distance, limb } = arg;
			if (limb === LOWER_LIMB) {
				const val = LimbCorrection.lower(alt, distance, radius);
				addCorrection('Limb correction', val);
			}
			if (limb === UPPER_LIMB) {
				const val = LimbCorrection.upper(alt, distance, radius);
				addCorrection('Limb correction', val);
			}
			addCorrection('Parallax', calcParallax(alt, distance));
		};

		if (config.moon != null) {
			moonSunCorrection(config.moon, Constants.moonRadius);
		}

		if (config.sun != null) {
			moonSunCorrection(config.sun, Constants.sunRadius);
		}

		text += '**Altitude**: `' + ctx.degFormat.stringify(alt) + '`\n'; 
		text += '**Co-altitude**: `' + ctx.degFormat.stringify(90 - alt) + '`\n'; 
		return ctx.msg.reply(text);
	},
});
