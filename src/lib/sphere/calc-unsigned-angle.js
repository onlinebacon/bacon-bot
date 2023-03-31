const { PI, sqrt, acos } = Math;

const calcUnsignedAngle = (adj, opp) => {
	const hip = sqrt(adj*adj + opp*opp);
	if (hip === 0) return 0;
	const temp = acos(adj/hip);
	return opp >= 0 ? temp : PI*2 - temp;
};

export default calcUnsignedAngle;
