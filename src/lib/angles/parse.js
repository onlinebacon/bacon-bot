const posRegex = /^[ne+]|[ne]$/i;
const negRegex = /^[sw-]|[sw]$/i;
const wordRegex = /\d+(\.\d+)?|[^\d]+/g;
const scaleMap = { '°': 1, "'": 1/60, '"': 1/3600 };
const parseAngle = (angle) => {
	let sign = 1;
	angle = angle.trim();
	if (negRegex.test(angle)) {
		sign = -1;
		angle = angle.replace(negRegex, '');
	} else {
		angle = angle.replace(posRegex, '');
	}
	angle = angle.trim();
	const words = angle.match(wordRegex).map(word => word.trim());
	let sum = 0;
	let last_scale = null;
	for (let i=0; i<words.length; i+=2) {
		const word = words[i];
		const next = words[i + 1]?.trim();
		const scale = scaleMap[next] ?? (last_scale ? last_scale/60 : 1);
		sum += Number(word)*scale;
		last_scale = scale;
	}
	return sum*sign;
};
export default parseAngle;
