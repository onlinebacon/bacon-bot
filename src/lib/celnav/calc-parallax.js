import Constants from '../constants/Constants.js';

const R = Constants.earthAverageRadius;

const cos = (deg) => Math.cos(deg/180*Math.PI);
const asin = (sin) => Math.asin(sin)/Math.PI*180;

const calcParallax = (alt, distance) => {
	return asin(cos(alt)*(R/distance));
};

export default calcParallax;
