const { PI, atan } = Math;
const TAU = PI*2;

const buildIcoPoints = () => {
	const lat = atan(1/2);
	const points = [
		[ PI/2, 0 ],
	];
	for (let i=0; i<5; ++i) {
		const lon = (i/5)*(PI*2);
		points.push([ lat, lon > PI ? lon - TAU : lon ]);
	}
	for (let i=0; i<5; ++i) {
		const lon = ((i/5)*(PI*2) + PI)%TAU;
		points.push([ -lat, lon > PI ? lon - TAU : lon ]);
	}
	points.push([ -PI/2, 0 ]);
	return points;
};

const icoPoints = buildIcoPoints();

export default icoPoints;
