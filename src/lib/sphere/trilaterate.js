import haversine from './haversine.js';
import sphereSearch from './sphere-search.js';

const trilaterate = (circles, maxIt, minRad) => {
	const objFn = (coord) => {
		let value = 0;
		for (const { center, radius } of circles) {
			const d = haversine(coord, center) - radius;
			value += d**2;
		}
		return value;
	};
	return sphereSearch(objFn, maxIt, minRad);
};

export default trilaterate;
