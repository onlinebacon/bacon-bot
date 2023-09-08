import calcSignedAngle from './calc-signed-angle.js';

const { sin, cos, asin } = Math;

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

export default shoot;
