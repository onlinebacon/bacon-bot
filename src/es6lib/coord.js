import { calcSignedAngle, calcUnsignedAngle } from './math.js';
import { rotXVec3, rotYVec3, rotZVec3 } from './matrix-math.js';
const { sin, cos, asin, acos } = Math;
export const coordToVec = ([ lat, lon ], dst = new Array(3)) => {
	const coslat = cos(lat);
	dst[0] = sin(lon)*coslat;
	dst[1] = sin(lat);
	dst[2] = cos(lon)*coslat;
	return dst;
};
export const vecToCoord = ([ x, y, z ], dst = new Array(2)) => {
	dst[0] = asin(y);
	dst[1] = calcSignedAngle(z, x);
	return dst;
};
export const haversine = ([ lat1, lon1 ], [ lat2, lon2 ]) => acos(
	sin(lat1)*sin(lat2) +
	cos(lat1)*cos(lat2)*cos(lon1 - lon2)
);
export const calcAzm = ([ lat1, lon1 ], [ lat2, lon2 ]) => {
	const lon_dif = lon2 - lon1;
	const x = sin(lon_dif);
	const y = sin(lat2)*cos(lat1)/cos(lat2) - cos(lon_dif)*sin(lat1);
	return calcUnsignedAngle(y, x);
};
export const shoot = ([ lat, lon ], azm, r, dst = new Array(2)) => {
	const vec = [ 0, sin(r), cos(r) ];
	rotZVec3(vec, azm, vec);
	rotXVec3(vec, lat, vec);
	rotYVec3(vec, -lon, vec);
	return vecToCoord(vec, dst);
};
