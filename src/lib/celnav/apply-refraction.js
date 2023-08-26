import calcAltRefraction from './calc-alt-refraction.js'
const removeRefraction = (alt, milibars, celsius) => alt - calcAltRefraction(alt, milibars, celsius);
const applyRefraction = (trueAlt, milibars, celsius) => {
	let alt = trueAlt;
	for (let i=0; i<10; ++i) {
		let temp = removeRefraction(alt, milibars, celsius);
		let dif = temp - trueAlt;
		if (dif === 0) break;
		alt -= dif;
	}
	return alt;
};
export default applyRefraction;
