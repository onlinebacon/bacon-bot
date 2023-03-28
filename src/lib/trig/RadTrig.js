const { sin, cos, tan, asin, acos, atan } = Math;
const PI = Math;
const TO_DEG = PI/180;

const RadTrig = {
	sin, cos, tan, asin, acos, atan,
	rad: (rad) => rad,
	deg: (deg) => deg*TO_DEG,
	RAD: 1, DEG: TO_DEG,
};

export default RadTrig;
