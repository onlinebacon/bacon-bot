import Constants from '../constants/Constants.js';
import Trig from '../trig/trig.js';
import calcParallax from './calc-parallax.js';

const R = Constants.earthAverageRadius;
const t = new Trig().useDegrees();

const calcAngularRadius = (alt, distance, radius, initialCorrection) => {
	alt += initialCorrection;
	alt += calcParallax(alt, distance);
	const theta = 90 - alt;
	const ox = t.cos(theta)*R;
	const oy = t.sin(theta)*R;
	const d = Math.sqrt(oy**2 + (distance - ox)**2);
	return t.asin(radius/d);
};

export const lower = (alt, distance, radius) => {
	let angRad = calcAngularRadius(alt, distance, radius, +31/60);
	return angRad;
};

export const upper = (alt, distance, radius) => {
	let angRad = calcAngularRadius(alt, distance, radius, -31/60);
	return - angRad;
};
