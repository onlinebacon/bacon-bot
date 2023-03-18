import haversine from '../lib/sphere/haversine.js';
import sphericalSearch from '../lib/sphere/spherical-search.js';
import parseAngle from '../lib/angles/parser.js';

const stirngifyAngle = (deg) => Number((deg).toFixed(4));
const radToDeg = (rad) => rad*(180/Math.PI);
const degToRad = (deg) => deg*(Math.PI/180);
const trilaterate = (circles) => {
	const fn = (coord) => {
		let sum = 0;
		for (const [ center, radius ] of circles) {
			const dist = haversine(center, coord);
			const err = radius - dist;
			sum += err*err;
		}
		return sum;
	};
	return sphericalSearch(fn);
};

export const init = (cli) => {
	cli.onMessage(async (msg) => {
		const text = msg.getText();
		if (!/\.trilaterate\s/.test(text)) return;
		let lines = text.replace(/\.trilaterate\s+/, '').trim().split(/\s*\n\s*/);
		const circles = lines.map(line => {
			const values = line.split(/\s*,\s*/).map(parseAngle);
			const [ lat, lon, radius ] = values.map(degToRad);
			const coord = [ lat, lon ];
			return [ coord, radius ];
		});
		const res = trilaterate(circles).map(radToDeg);
		msg.reply(res.map(stirngifyAngle).join(', '));
	});
};
