import Commands from '../lib/commands.js';
import Angle from '../lib/angle-format/angle-format.js';
import Distance from '../lib/distance.js';
import { calcAzAlt } from '../lib/globe-math.js';

const parseToRadians = (str) => Angle.parse(str)/180*Math.PI;

Commands.add('az-alt')
.splitArgs()
.setHandler(async (msg, args) => {
	let [ aLat, aLon, bLat, bLon, dist = Infinity ] = args;
	let observer_gp = [ aLat, aLon ].map(parseToRadians);
	let body_gp = [ bLat, bLon ].map(parseToRadians);
	if (typeof dist === 'string') dist = Distance.parse(dist);
	const [ az, alt ] = calcAzAlt(observer_gp, body_gp, dist).map(radians => {
		return Angle.stringify(radians*180/Math.PI);
	});
	msg.reply('```\n' + `Az: ${az}\nTrue alt: ${alt}` + '```');
});
