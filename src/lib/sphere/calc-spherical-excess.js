import calcOriginAlignedCirclesIntersection from './calc-origin-aligned-circles-intersection.js';
import calcUnsignedAngle from './calc-unsigned-angle.js';
import { coordToVec } from './coord.js';
import { rotateVecX, rotateVecY, rotateVecZ } from './vec.js';

const { PI } = Math;

const calcSphericalExcess = (a, b, c) => {
	const p1 = calcOriginAlignedCirclesIntersection(b, c, a);
	const ang1 = calcUnsignedAngle(p1[1], p1[0]);
	const p2 = rotateVecX(p1, -a);
	const ang2 = calcUnsignedAngle(-p2[1], p2[0]);
	const p3 = rotateVecZ(coordToVec([ a, 0 ]), PI/2 - ang1);
	const p4 = rotateVecY(p3, b);
	const ang3 = calcUnsignedAngle(-p4[0], p4[1]);
	return ang1 + ang2 + ang3 - PI;
};

export default calcSphericalExcess;
