import { abs, round, padTwo, padTwoLast } from './utils.js';

const decimal = (angle, [ posPrefix, negPrefix ] = [ '', '-' ], digits) => {
	const prefix = angle >= 0 ? posPrefix : negPrefix;
	return prefix + Number(abs(angle).toFixed(digits)) + '°';
};

const arcMins = (angle, [ posPrefix, negPrefix ] = [ '', '-' ]) => {
	const prefix = angle >= 0 ? posPrefix : negPrefix;
	const totalArcMins = round(abs(angle)*600)/10;
	const arcMins = totalArcMins % 60;
	const degrees = round((totalArcMins - arcMins)/60);
	return `${prefix}${degrees}°${padTwoLast(arcMins)}'`;
};

const arcSecs = (angle, [ posPrefix, negPrefix ] = [ '', '-' ]) => {
	const prefix = angle >= 0 ? posPrefix : negPrefix;
	const totalArcSecs = round(abs(angle)*36000)/10;
	const arcSecs = totalArcSecs % 60;
	const totalArcMins = round((totalArcSecs - arcSecs)/60);
	const arcMins = totalArcMins % 60;
	const degrees = round((totalArcMins - arcMins)/60);
	return `${prefix}${degrees}°${padTwo(arcMins)}'${padTwoLast(arcSecs)}"`;
};

class Stringifier {
	constructor(fn, digits) {
		this.fn = fn;
		this.nDigits = digits;
	}
	decimal() {
		return new Stringifier(decimal, this.nDigits);
	}
	arcSecs() {
		return new Stringifier(arcSecs, this.nDigits);
	}
	arcMins() {
		return new Stringifier(arcMins, this.nDigits);
	}
	digits(nDigits) {
		return new Stringifier(this.fn, nDigits);
	}
	stringify(angle, prefix) {
		return this.fn(angle, prefix, this.nDigits);
	}
}

const DegFormats = new Stringifier(decimal, 6);

export default DegFormats;
