import parseAngle from '../lib/angles/parse.js';
import stringifyAngle from '../lib/angles/stringify.js';
import calcAltRefraction from '../lib/celnav/calc-alt-refraction.js';
import calcDipAngle from '../lib/celnav/calc-dip-angle.js';

const commandRegex = /^\.correct-alt\b/;
const numRegex = /^\d+(\.\d+)?/;
const lengthUnits = {
	'm' : 1,
	'ft': 0.3048,
	'km': 1000,
	'mi': 1609.344,
	'au': 149597870700,
	'ly': 299792458*365.25*24*60*60,
};
const knownConfigs = [ 'dip', 'ref', 'index' ];

const parseDistance = (str) => {
	let [ num ] = str.match(numRegex).map(Number);
	str = str.replace(numRegex, '');
	let unit = str.trim().toLowerCase();
	return lengthUnits[unit]*num;
};

const handleFormatError = (msg) => {
	return msg.reply(
		`:thinking: There's something wrong with your command format\n`
		+ '\n'
		+ 'Check these examples:\n'
		+ `> .correct-alt 43° 29.2' (dip: 10m, index: 1', ref: std)\n`
		+ `> .correct-alt 25.345 (dip: 20ft)\n`
	);
};

const stringifyAngleChange = (value) => {
	const sign = value >= 0 ? '+' : '-';
	return sign + stringifyAngle(Math.abs(value));
};

export const init = (cli) => {
	cli.onMessage(async (msg) => {
		const text = msg.getText();
		if (!commandRegex.test(text)) return;
		let arg = text.replace(commandRegex, '').trim().toLowerCase();
		let [, angle, configs ] = arg.match(/([^(]+)\((.*)\)/) ?? [];
		if (!angle || !configs) return handleFormatError(msg);
		angle = parseAngle(angle.trim());
		if (isNaN(angle)) return handleFormatError(msg);
		configs = configs.trim().split(/\s*,\s*/);
		const configMap = {};
		for (let config of configs) {
			const [ name, value ] = config.split(/\s*:\s*/);
			if (!name || !value) return handleFormatError(msg);
			if (!knownConfigs.includes(name)) return handleFormatError(msg);
			configMap[name] = value;
		}
		let steps = stringifyAngle(angle) + '\n';
		if (configMap.index) {
			const index = parseAngle(configMap.index);
			if (isNaN(index)) return handleFormatError(msg);
			angle -= index;
			steps += stringifyAngleChange(-index) + ' (index error)\n';
		}
		if (configMap.dip) {
			const h = parseDistance(configMap.dip);
			if (isNaN(h)) return handleFormatError(msg);
			const dip = calcDipAngle(h);
			angle -= dip;
			steps += stringifyAngleChange(-dip) + ' (dip)\n';
		}
		if (configMap.ref) {
			if (configMap.ref !== 'std') return handleFormatError(msg);
			const ref = calcAltRefraction(angle);
			angle -= ref;
			steps += stringifyAngleChange(-ref) + ' (refraction)\n';
		}
		steps += `Altitude: ${stringifyAngle(angle)}\n`;
		steps += `Co-altitude: ${stringifyAngle(90 - angle)}\n`;
		return msg.reply('```\n' + steps + '```');
	});
};
