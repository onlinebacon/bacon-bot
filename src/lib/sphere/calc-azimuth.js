const { PI, sqrt, sin, cos, acos } = Math;

const calcAzimuth = ([ lat1, lon1 ], [ lat2, lon2 ]) => {
	const lha = lon1 - lon2;
	const cosLat2 = cos(lat2);
	const x = sin(lha)*cosLat2;
	const y = sin(lat2);
	const z = cos(lha)*cosLat2;
	const w = y*cos(lat1) - z*sin(lat1);
	const t = acos(w/sqrt(w**2 + x**2));
	return x <= 0 ? t : PI*2 - t;
};

export default calcAzimuth;
