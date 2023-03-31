const { sqrt, sin, cos } = Math;

const calcOriginAlignedCirclesIntersection = (r1, r2, d) => {
	const r = sin(r1);
	const vlen = cos(r2);
	const cosd = cos(d);
	const sind = sin(d);
	const vz = cosd*vlen;
	const vy = sind*vlen;
	const m = - cosd/sind;
	const c = vy - vz*m;
	const iz = cos(r1);
	const iy = iz*m + c;
	const ix = sqrt(r*r - iy*iy);
	return [ ix, iy, iz ];
};

export default calcOriginAlignedCirclesIntersection;
