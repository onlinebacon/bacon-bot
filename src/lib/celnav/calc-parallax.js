import Constants from '../constants/Constants.js';
import Trig from '../trig/trig.js';

const t = new Trig().useDegrees();
const R = Constants.earthAverageRadius;

const calcParallax = (alt, distance) => {
	return t.asin(t.cos(alt)*(R/distance));
};

export default calcParallax;
