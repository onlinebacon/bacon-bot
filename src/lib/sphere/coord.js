import calcSignedAngle from './calc-signed-angle.js';

const { sin, cos, asin } = Math;

export const coordToVec = ([ lat, lon ]) => {
	const cos_lat = cos(lat);
	return [
		sin(lon)*cos_lat,
		sin(lat),
		cos(lon)*cos_lat,
	];
};

export const vecToCoord = ([ x, y, z ]) => {
	const lat = asin(y);
	const lon = calcSignedAngle(z, x);
	return [ lat, lon ];
};
