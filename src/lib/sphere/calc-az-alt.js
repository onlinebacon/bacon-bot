import calcUnsignedAngle from './calc-unsigned-angle.js';
import { coordToVec } from './coord.js';
import { rotateVecX, rotateVecY, normalize } from './vec.js';

const { asin } = Math;

const calcAzAlt = (observer_gp, body_gp, radius_height_ratio = 0) => {
	let vec = coordToVec(body_gp);
	vec = rotateVecY(vec, observer_gp[1]);
	vec = rotateVecX(vec, -observer_gp[0]);
	vec[2] -= radius_height_ratio;
	vec = normalize(vec);
	const azm = calcUnsignedAngle(vec[1], vec[0]);
	const alt = asin(vec[2]);
	return [ azm, alt ];
};

export default calcAzAlt;
