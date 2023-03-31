const { sqrt, sin, cos } = Math;

export const rotateVecX = ([ x, y, z ], angle) => {
	const s = sin(angle);
	const c = cos(angle);
	return [ x, y*c + z*s, z*c - y*s ];
};

export const rotateVecY = ([ x, y, z ], angle) => {
	const s = sin(angle);
	const c = cos(angle);
	return [ x*c - z*s, y, z*c + x*s ];
};

export const rotateVecZ = ([ x, y, z ], angle) => {
	const s = sin(angle);
	const c = cos(angle);
	return [ x*c + y*s, y*c - x*s, z ];
};

export const normalize = ([ x, y, z ]) => {
	const len = sqrt(x*x + y*y + z*z);
	return [ x/len, y/len, z/len ];
};
