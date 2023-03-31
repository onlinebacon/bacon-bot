const { sqrt, acos } = Math;

const calcSignedAngle = (adj, opp) => {
	const hip = sqrt(adj*adj + opp*opp)
	if (hip === 0) return 0;
	const temp = acos(adj/hip);
	return opp >= 0 ? temp : - temp;
};

export default calcSignedAngle;
