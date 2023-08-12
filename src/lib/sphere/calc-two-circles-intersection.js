const { sin, cos, asin, acos, sqrt } = Math;

const calcTwoCirclesIntersections = (lat_a, lon_a, rad_a, lat_b, lon_b, rad_b) => {
	const cosLatB = cos(lat_b);
	const bx0 = cos(lon_b)*cosLatB;
	const by0 = sin(lat_b);
	const bz0 = sin(lon_b)*cosLatB;
	const cosLonA = cos(lon_a);
	const sinLonA = sin(lon_a);
	const bx1 = bx0*cosLonA + bz0*sinLonA;
	const bz1 = bz0*cosLonA - bx0*sinLonA;
	const cosLatA = cos(lat_a);
	const sinLatA = sin(lat_a);
	const by2 = by0*cosLatA - bx1*sinLatA;
	const by3 = sqrt(by2**2 + bz1**2);
	const sin_az = bz1/by3;
	const cos_az = by2/by3;
	const cosRadB = cos(rad_b);
	const vx = (bx1*cosLatA + by0*sinLatA)*cosRadB;
	const vy = by3*cosRadB;
	const m = -vx/vy;
	const ix0 = cos(rad_a);
	const iy0 = ix0*m + vy - vx*m;
	const iz0 = sqrt(1 - ix0**2 - iy0**2);
	const solveForIz0 = (iz0) => {
		const ix1 = ix0;
		const iy1 = iy0*cos_az - iz0*sin_az;
		const ix2 = ix1*cosLatA - iy1*sinLatA;
		const iz2 = iz0*cos_az + iy0*sin_az;
		const ix3 = ix2*cos(lon_a) - iz2*sinLonA;
		const iz3 = iz2*cos(lon_a) + ix2*sinLonA;
		const lat = asin(iy1*cosLatA + ix1*sinLatA);
		const lon_abs = acos(ix3/sqrt(ix3**2 + iz3**2));
		const lon = iz3 >= 0 ? lon_abs : - lon_abs;
		return [ lat, lon ];
	};
	return [ solveForIz0(iz0), solveForIz0(-iz0) ];
};

export default calcTwoCirclesIntersections;
