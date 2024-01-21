import calcAriesGHA from '../lib/celnav/calc-aries-gha.js';
import Commands from '../lib/commands/Commands.js';
import Skyfield from '../lib/skyfield/skyfield.js';

const calcLon = (ariesGHA, raDeg) => {
	const lon = (raDeg - ariesGHA + 360 + 180)%360 - 180;
	return lon;
};

const calcLat = (dec) => {
	return dec;
};

const getGPLine = (ctx, unixTime, { ra, dec }) => {
	const raVal = ctx.ra.fromHours(ra);
	const ariesGHA = calcAriesGHA(unixTime);
	const lat = calcLat(dec);
	const raDeg = ctx.ra.toDegrees(raVal);
	const lon = calcLon(ariesGHA, raDeg);
	const latStr = ctx.latLon.stringifyLat(lat);
	const lonStr = ctx.latLon.stringifyLon(lon);
	return `GP: ${latStr}, ${lonStr}`;
};

const formatZone = (str) => {
	if (/^(gmt|utc)$/i.test(str)) return '+0000';
	str = str.replace(/^(gmt|utc)/i, '');
	const sign = str.match(/^[-+]/)?.[0] ?? '+';
	str = str.replace(/^[-+]\s*/, '');
	const [ hr, min = '0' ] = str.split(':');
	return sign + hr.padStart(2, '0') + min.padStart(2, '0');
};

const parseDate = (str) => {
	if (/^now$/i.test(str)) return Math.round(Date.now()/1000);
	str = str.replace(/-(\d)\b/g, '-0$1');
	str = str.replace(/:(\d)\b/g, ':0$1');
	str = str.replace(/\b(\d):/g, '0$1:');
	const [ date, time, zone = 'UTC' ] = str.split(/\s+/);
	const iso = date + 'T' + time + formatZone(zone);
	const datetime = new Date(iso);
	const unixTime = datetime.getTime()/1000;
	return unixTime;
};

Commands.add({
	name: 'gp-list',
	listed: true,
	description: 'It calculates the geographical position of a list of celestial bodies and timestamps',
	syntax: '.gp-list BODY, UTC_TIME',
	examples: [],
	handler: async function({ ctx, args }) {
		const lines = args.split(/\s*\n\s*/);
		let message = '';
		for (let line of lines) {
			const args = line.split(/\s*,\s*/);
			if (args.length !== 2) {
				return ctx.msg.reply(`Invalid input`);
			}
			const [ bodyName = '', strDate = 'now' ] = args;
			const unixTime = parseDate(strDate);
			if (isNaN(unixTime)) {
				return ctx.msg.reply(`Invalid date`);
			}
			const path = Skyfield.buildPath(bodyName, unixTime);
			if (path == null) {
				return ctx.msg.reply(`**${bodyName}** is not a recognized body`);
			}
			const info = await Skyfield.get(path);
			message += getGPLine(ctx, unixTime, info) + '\n';
		}
		return ctx.msg.reply(message.trim());
	},
});
