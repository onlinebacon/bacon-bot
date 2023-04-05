import Constants from '../constants/Constants.js';

const r = Constants.earthAverageRadius*7/6;
const calcDip = (height) => {
	return Math.acos(r/(r + height))/Math.PI*180;
}

export default calcDip;
