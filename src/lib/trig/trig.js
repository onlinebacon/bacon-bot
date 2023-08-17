const { PI } = Math;

export default class Trig {
	constructor(RADIAN = 180/PI) {
		this.RADIAN = RADIAN;
		this.DEGREE = RADIAN/180*PI;
		this.TO_RAD = 1/RADIAN;
		this.TO_DEG = 180/(RADIAN*PI);
	}
	deg(value) { return value*this.DEGREE; }
	rad(value) { return value*this.RADIAN; }
	sin(value) { return Math.sin(value*this.TO_RAD); }
	cos(value) { return Math.cos(value*this.TO_RAD); }
	tan(value) { return Math.tan(value*this.TO_RAD); }
	asin(value) { return Math.asin(value)*this.RADIAN; }
	acos(value) { return Math.acos(value)*this.RADIAN; }
	atan(value) { return Math.atan(value)*this.RADIAN; }
	toDeg(value) { return value*this.TO_DEG; }
	toRad(value) { return value*this.TO_RAD; }
	useRadians() { return new Trig(1); }
	useDegrees() { return new Trig(180/PI); }
}
