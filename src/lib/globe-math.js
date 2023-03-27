import { Vec3 } from './matrix-math.js';

const EARTH_RADIUS_METERS = 6371008.8;
const calcAngle = (adj, opp) => {
	const hip = Math.sqrt(adj*adj + opp*opp);
	if (hip === 0) return 0;
	return opp >= 0 ? Math.acos(adj/hip) : Math.PI*2 - Math.acos(adj/hip);
};

export const calcAzAlt = (observer_gp, body_gp, body_dist_meters) => {
	const vec = new Vec3([ 0, 0, 1 ]);
	vec.rotateX(body_gp[0]);
	vec.rotateY(-body_gp[1]);
	vec.rotateY(observer_gp[1]);
	vec.rotateX(-observer_gp[0]);
	vec.z -= EARTH_RADIUS_METERS/body_dist_meters;
	vec.normalize();
	const azm = calcAngle(vec.y, vec.x);
	const alt = Math.asin(vec.z);
	return [ azm, alt ];
};
