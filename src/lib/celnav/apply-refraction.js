import calcAltRefraction from './calc-alt-refraction.js'
const removeRefraction = (alt) => alt - calcAltRefraction(alt);
const applyRefraction = (trueAlt) => {
	if (trueAlt > 89) return trueAlt;
	let alt = trueAlt;
	for (let i=0; i<10; ++i) {
		let temp = removeRefraction(alt);
		let dif = temp - trueAlt;
		if (dif === 0) break;
		alt -= dif;
	}
	return alt;
};
export default applyRefraction;
