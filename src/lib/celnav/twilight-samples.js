import { shoot } from '../../es6lib/coord.js';

const { PI } = Math;
const toDeg = (rad) => rad*(180/PI);
const toRad = (deg) => deg*(PI/180);
const twilightDist = toRad(99);

const twilightSamples = (sunGp, n, offset) => {
	const angleOffset = PI*2/n*offset;
	const angleStep = PI*2/n;
	const samples = new Array(n);
	for (let i=0; i<n; ++i) {
		const dir = angleOffset + angleStep*i;
		samples[i] = shoot(sunGp, dir, twilightDist).map(toDeg);
	}
	return samples;
};

export default twilightSamples;
