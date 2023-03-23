import Angle from '../lib/angle-format/angle-format.js';
import getAriesGHA from '../lib/celnav/get-aries-gha.js';
import Skyfield from '../lib/skyfield.js';
import ClientAdapter from '../wrappers/client-wrapper.js';
import MessageAdapter from '../wrappers/message-wrapper.js';

const planets = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'];
const bodies = ['sun', 'moon'];
const stars = {
	677: /^alpheratz$/i,
	2081: /^ankaa$/i,
	3179: /^sc?hed[ai]r$/i,
	3419: /^diphda$/i,
	7588: /^achernar$/i,
	9884: /^hamal$/i,
	11767: /^polaris$/i,
	13847: /^acamar$/i,
	14135: /^menkar$/i,
	15863: /^mirfak$/i,
	21421: /^aldebaran$/i,
	24436: /^rigel$/i,
	24608: /^capella$/i,
	25336: /^bellatrix$/i,
	25428: /^elnath$/i,
	26311: /^alnilam$/i,
	27989: /^betelgeuse$/i,
	30438: /^canopus$/i,
	32349: /^sirius$/i,
	33579: /^adhara$/i,
	37279: /^procyon$/i,
	37826: /^pollux$/i,
	41037: /^avior$/i,
	44816: /^suhail$/i,
	45238: /^miaplacidus$/i,
	46390: /^alphard$/i,
	49669: /^regulus$/i,
	54061: /^dubhe$/i,
	57632: /^denebola$/i,
	59803: /^gienah$/i,
	60718: /^acrux$/i,
	61084: /^gacrux$/i,
	62956: /^alioth$/i,
	65474: /^spica$/i,
	67301: /^alkaid$/i,
	68702: /^hadar$/i,
	68933: /^menkent$/i,
	69673: /^arcturus$/i,
	71683: /^rig[ie]l\s+kent(\.|aurus)?$/i,
	72607: /^koch?ab$/i,
	72622: /^zuben('?\s*)(elgen)?ubi$/i,
	76267: /^alphecca$/i,
	80763: /^antares$/i,
	82273: /^atria$/i,
	84012: /^sabik$/i,
	85927: /^shaula$/i,
	86032: /^rasalhague$/i,
	87833: /^eltanin$/i,
	90185: /^kaus\s+aust(\.|ralis)?$/i,
	91262: /^vega$/i,
	92855: /^nunki$/i,
	97649: /^altair$/i,
	100751: /^peacock$/i,
	102098: /^deneb$/i,
	107315: /^enif$/i,
	109268: /^al\s*na'?ir$/i,
	113368: /^fomalhaut$/i,
	113881: /^scheat$/i,
	113963: /^markab$/i,
};

const handleInvalidSyntax = (msg) => {
	return msg.reply('Invalid syntax\n' +
		'Expected syntax: `.get-gp <body>, <time>`\n' +
		'Examples:\n' +
		'> .get-gp saturn, 2023-03-13 00:17:52 GMT-5\n' +
		'> .get-gp polaris, 2023-07-22 15:00:12 UTC\n');
};

const toISOZone = (zone) => {
	if (/^(utc|gmt)$/i.test(zone)) return 'Z';
	if (/^(utc|gmt)\s*[-+]\s*\d+(:\d+)?$/i.test(zone)) {
		return zone.replace(/(utc|gmt)\s*/i, '')
			.replace(/\s+/g, '')
			.replace(/\d+/g, str => str.padStart(2, '0'))
			.replace(/:/, '')
			.padEnd(5, '0');
	};
};

const parseTime = (time) => {
	if (/^\s*now\s*$/i.test(time)) return new Date(Math.floor(Date.now()/1000)*1000);
	const [ dt, t, zone = 'UTC' ] = time.split(/\s+/);
	const iso = dt + 'T' + t + toISOZone(zone);
	return new Date(iso);
};

const getStarHip = (name) => {
	for (const hip in stars) {
		const regex = stars[hip];
		if (regex.test(name)) return hip;
	}
	return null;
};

const getPath = (name) => {
	const planet = planets.find(planet => planet.toLowerCase() === name.toLowerCase());
	if (planet) return '/planet/' + name;
	const body = bodies.find(body => body.toLowerCase() === name.toLowerCase());
	if (body) return '/' + name;
	const hip = getStarHip(name);
	if (hip) return '/hip/' + hip;
	return null;
};

const stringifyRa = (ra) => Angle.hours.stringify(ra);
const stringifyDeg = (deg) => Angle.degrees.stringify(deg);
const stringifyDist = (dist) => Math.round(dist/1000) + ' km';
const stringifyDate = (date) => {
	let str = date.toISOString();
	str = str.replace(/[tz]/ig, '\x20');
	str = str.replace(/\.\d+/, '');
	return str.trim() + ' UTC';
};
const hoursToDeg = (hours) => hours/24*360;
const ghaToLon = (gha) => 180 - (gha + 180)%360;
const stringifyLatLon = ([ lat, lon ]) => {
	return stringifyDeg(lat) + ', ' + 	stringifyDeg(lon);
};

const getInfoMessage = (unixtime, data) => {
	const { ra, dec, dist } = data;
	let info = '```\n';
	const ariesGHA = getAriesGHA(unixtime);
	info += 'Time: ' + stringifyDate(new Date(unixtime*1000)) + '\n';
	info += 'GHA of aries: ' + stringifyDeg(ariesGHA) + '\n';
	info += `Ra/Dec: ${stringifyRa(ra)}/${stringifyDeg(dec)}\n`;
	if (dist) {
		info += `Distance: ${stringifyDist(dist)}\n`;
	}
	const sha = 360 - hoursToDeg(ra);
	const gha = (ariesGHA + sha)%360;
	const lat = dec;
	const lon = ghaToLon(gha);
	info += `SHA: ${stringifyDeg(sha)}\n`;
	info += `GHA: ${stringifyDeg(gha)}\n`;
	info += `GP: ${stringifyLatLon([ lat, lon ])}\n`;
	return info + '```';
};

const regex = /^.get-gp(\s|$)/;
export const init = async (cli = new ClientAdapter()) => {
	cli.onMessage(async (msg = new MessageAdapter()) => {
		const text = msg.getText();
		if (!regex.test(text)) return;
		const args = text.replace(regex, '').trim().split(/\s*,\s*/);
		const [ body, time ] = args;
		if (!body || !time) return handleInvalidSyntax(msg);
		const path = getPath(body);
		if (!path) return msg.reply(`Unrecognized body **${body}**`);
		const unix = parseTime(time).getTime()/1000;
		if (isNaN(unix)) return msg.reply(`Invalid time format **${time}**`);
		const fullpath = '/time/' + unix + path;
		try {
			const data = await Skyfield.get(fullpath);
			msg.reply(getInfoMessage(unix, data));
		} catch(err) {
			console.error(err);
			msg.reply(`Sorry, something went wrong`);
		}
	});
};
