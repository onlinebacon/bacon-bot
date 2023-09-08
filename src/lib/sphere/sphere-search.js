import icoPoints from './ico-points.js';

const { PI, atan } = Math;
const TAU = PI*2;

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
