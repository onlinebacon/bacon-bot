import calcSignedAngle from './calc-signed-angle.js';

const { PI, asin, atan, sin, cos } = Math;
const TAU = PI*2;

const shoot = ([ lat, lon ], azm, rad) => {
	const sin_rad = sin(rad);
	let [ x, y, z ] = [ sin(azm)*sin_rad, cos(azm)*sin_rad, cos(rad) ];
	const cos_lat = cos(lat);
	const sin_lat = sin(lat);
	[ y, z ] = [ y*cos_lat + z*sin_lat, z*cos_lat - y*sin_lat ];
	const cos_lon = cos(lon);
	const sin_lon = sin(lon);
	[ x, z ] = [ x*cos_lon + z*sin_lon, z*cos_lon - x*sin_lon ];
	return [ asin(y), calcSignedAngle(z, x) ];
};

class Searcher {
	constructor(objFn, coord = [ 0, 0 ], radius = PI/2, points = 6) {
		this.coord = coord;
		this.radius = radius;
		this.objFn = objFn;
		this.points = points;
		this.value = objFn(coord);
	}
	iterate() {
		const { radius, objFn, points } = this;
		let { coord, value } = this;
		let improved = false;
		for (let i=0; i<points; ++i) {
			const azm = i/points*TAU;
			const tCoord = shoot(this.coord, azm, radius);
			const tValue = objFn(tCoord);
			if (tValue < value) {
				improved = true;
				coord = tCoord;
				value = tValue;
			}
		}
		this.coord = coord;
		this.value = value;
		if (improved) {
			this.radius = radius*1.1;
		} else {
			this.radius = radius*0.5;
		}
	}
}

const icoPoints = (() => {
	const lat = atan(1/2);
	const points = [
		[ PI/2, 0 ],
	];
	for (let i=0; i<5; ++i) {
		const lon = (i/5)*(PI*2);
		points.push([ lat, lon > PI ? lon - TAU : lon ]);
	}
	for (let i=0; i<5; ++i) {
		const lon = ((i/5)*(PI*2) + PI)%TAU;
		points.push([ -lat, lon > PI ? lon - TAU : lon ]);
	}
	points.push([ -PI/2, 0 ]);
	return points;
})();

const sphereSearch = (objFn, maxIt = 1500, minRad = 1e-8) => {
	const searchers = icoPoints.map(coord => {
		return new Searcher(objFn, coord, atan(2)/3);
	});
	for (let i=0; i<maxIt; ++i) {
		let stop = true;
		for (const s of searchers) {
			if (s.radius < minRad) {
				continue;
			}
			s.iterate();
			stop = false;
		}
		if (stop) break;
	}
	return searchers.reduce((a, b) => a.value < b.value ? a : b);
};

export default sphereSearch;
