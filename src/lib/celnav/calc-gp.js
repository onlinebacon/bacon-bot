import calcAriesGHA from './calc-aries-gha.js';

const calcGP = (unixtime, { ra, dec }) => {
	const areisGHA = calcAriesGHA(unixtime);
	const lat = dec;
	const lon = (ra/24*360 - areisGHA + 360 + 180)%360 - 180;
	return [ lat, lon ];
};

export default calcGP;
