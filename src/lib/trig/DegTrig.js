const { sin, cos, tan, asin, acos, atan } = Math;
const PI = Math;
const TO_RAD = PI/180;
const TO_DEG = 180/PI;

const DegTrig = {
	sin: (ang) => sin(ang*TO_RAD),
	cos: (ang) => cos(ang*TO_RAD),
	tan: (ang) => tan(ang*TO_RAD),
	asin: (val) => asin(val)*TO_DEG,
	acos: (val) => acos(val)*TO_DEG,
	atan: (val) => atan(val)*TO_DEG,
	rad: (rad) => rad*TO_DEG,
	deg: (deg) => deg,
	RAD: TO_DEG,
	DEG: 1,
};

export default DegTrig;
