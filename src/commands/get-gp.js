import calcAriesGHA from '../lib/celnav/calc-aries-gha.js';
import Commands from '../lib/commands/Commands.js';
import Skyfield from '../lib/skyfield/skyfield.js';

const calcLon = (ariesGHA, raDeg) => {
	const lon = (raDeg/24*360 - ariesGHA + 360 + 180)%360 - 180;
	return lon;
};

const calcLat = (dec) => {
	return dec;
};

const compileInfo = (ctx, unixtime, { ra, dec, dist }) => {
	let message = '';
	const raVal = ctx.ra.fromHours(ra);
	const strRa = ctx.ra.stringify(raVal);
	const strDec = ctx.degFormat.stringify(dec);
	const strDist = ctx.lengthUnit.stringify(ctx.lengthUnit.parse(dist + 'm'));
	const ariesGHA = calcAriesGHA(unixtime);
	const strAriesGHA = ctx.degFormat.stringify(ariesGHA);
	const lat = calcLat(dec);
	const lon = calcLon(ariesGHA, ctx.ra.toDegrees(raVal));
	const latStr = ctx.latLon.stringifyLat(lat);
	const lonStr = ctx.latLon.stringifyLon(lon);
	message += `**Ra/Dec**: \`${strRa}\` / \`${strDec}\`\n`;
	message += `**Distance**: \`${strDist}\`\n`;
	message += `**Aries GHA**: \`${strAriesGHA}\`\n`;
	message += `**GP**: \`${latStr}\`, \`${lonStr}\`\n`;
	return message;
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
	const unixtime = Math.round(datetime.getTime()/1000);
	return unixtime;
};

Commands.add({
	name: 'get-gp',
	listed: true,
	description: 'Get ground position (and more) of a celestial body at a given point in time',
	syntax: '.get-gp BODY, DATETIME',
	examples: [
		'.get-gp sun, 2023-01-01 23:00:51 UTC',
		'.get-gp jupiter, 2022-06-25 16:01:34 GMT-3',
		'.get-gp polaris, 2023-02-16 15:11:21',
		'.get-gp moon, now',
	],
	argSep: ',',
	handler: async function({ ctx, args }) {
		if (args.length < 1) return this.handleBadSyntax(ctx, `Missing arguments`);
		if (args.length > 2) return this.handleBadSyntax(ctx, `Too many arguments`);
		const [ bodyName = '', strDate = 'now' ] = args;
		const unixtime = parseDate(strDate);
		if (isNaN(unixtime)) {
			return ctx.msg.reply(`Invalid date`);
		}
		const path = Skyfield.buildPath(bodyName, unixtime);
		if (path == null) {
			return ctx.msg.reply(`**${bodyName}** is not a recognized body`);
		}
		const info = await Skyfield.get(path);
		const message = compileInfo(ctx, unixtime, info);
		return ctx.msg.reply(message);
	},
});
