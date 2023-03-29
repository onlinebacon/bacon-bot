const rotateX = ([ x, y, z ], angle) => {
	const sin = Math.sin(angle);
	const cos = Math.cos(angle);
	return [ x, y*cos + z*sin, z*cos - y*sin ];
};

const rotateY = ([ x, y, z ], angle) => {
	const sin = Math.sin(angle);
	const cos = Math.cos(angle);
	return [ x*cos - z*sin, y, z*cos + x*sin ];
};

const normalize = ([ x, y, z ]) => {
	const len = Math.sqrt(x*x + y*y + z*z);
	return [ x/len, y/len, z/len ];
};

const calcAngle = (adj, opp) => {
	const hip = Math.sqrt(adj*adj + opp*opp);
	if (hip === 0) return 0;
	return opp >= 0 ? Math.acos(adj/hip) : Math.PI*2 - Math.acos(adj/hip);
};

const calcAzAlt = (observer_gp, body_gp, radius_height_ratio = 0) => {
	let vec = [ 0, 0, 1 ];
	vec = rotateX(vec, body_gp[0]);
	vec = rotateY(vec, -body_gp[1]);
	vec = rotateY(vec, observer_gp[1]);
	vec = rotateX(vec, -observer_gp[0]);
	vec[2] -= radius_height_ratio;
	vec = normalize(vec);
	const azm = calcAngle(vec[1], vec[0]);
	const alt = Math.asin(vec[2]);
	return [ azm, alt ];
};

export default calcAzAlt;
