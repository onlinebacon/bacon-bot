const { sqrt, sin, cos, tan, asin, acos } = Math;

const coordToVec = ([ lat, lon ]) => {
	const cos_lat = cos(lat);
	const x = sin(lon)*cos_lat;
	const y = sin(lat);
	const z = cos(lon)*cos_lat;
	return [ x, y, z ];
};

const calcVecDist = ([ ax, ay, az ], [ bx, by, bz ]) => {
	const dx = bx - ax;
	const dy = by - ay;
	const dz = bz - az;
	return sqrt(dx*dx + dy*dy + dz*dz);
};

const projectTValue = (chord, t) => {
	const halfChord = chord/2;
	const halfArc = asin(halfChord);
	const depth = sqrt(1 - halfChord*halfChord);
	const arc = halfArc*2;
	const angle = halfArc - arc*t;
	const dist = halfChord - tan(angle)*depth;
	return dist/chord;
};

const interpolateVecs = (a, b, t) => {
	const [ ax, ay, az ] = a;
	const [ bx, by, bz ] = b;
	const x = ax + (bx - ax)*t;
	const y = ay + (by - ay)*t;
	const z = az + (bz - az)*t;
	return [ x, y, z ];
};

const normalize = ([ x, y, z ]) => {
	const len = sqrt(x*x + y*y + z*z);
	return [ x/len, y/len, z/len ];
};

const vecToCoord = ([ x, y, z ]) => {
	const lat = asin(y);
	const rad = sqrt(x*x + z*z);
	if (rad === 0) return [ lat, 0 ];
	const tmp = acos(z/rad);
	const lon = x >= 0 ? tmp : - tmp;
	return [ lat, lon ];
};

const interpolateCoords = (aCoord, bCoord, val) => {
	const aVec = coordToVec(aCoord);
	const bVec = coordToVec(bCoord);
	const chord = calcVecDist(aVec, bVec);
	const t = projectTValue(chord, val);
	const vec = interpolateVecs(aVec, bVec, t);
	const normal = normalize(vec);
	return vecToCoord(normal);
};

export default interpolateCoords;
