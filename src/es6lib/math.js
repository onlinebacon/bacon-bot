export const calcSignedAngle = (adj, opp) => {
	const len = Math.sqrt(adj*adj + opp*opp);
	if (len === 0) {
		return 0;
	}
	const acos = Math.acos(adj/len);
	return (opp >= 0) ? acos : -acos;
};

export const calcUnsignedAngle = (adj, opp) => {
	const len = Math.sqrt(adj*adj + opp*opp);
	if (len === 0) {
		return 0;
	}
	const acos = Math.acos(adj/len);
	return (opp >= 0) ? acos : PI*2 - acos;
};
