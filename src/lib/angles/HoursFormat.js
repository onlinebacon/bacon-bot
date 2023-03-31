import { abs, round, padTwo, padTwoLast } from './utils.js';

const stringifyHours = (value) => {
	const totalSecs = round(abs(value)*36000)/10;
	const secs = totalSecs % 60;
	const totalMins = round((totalSecs - secs)/60);
	const mins = totalMins % 60;
	const hours = round((totalMins - mins)/60);
	return `${hours}h${padTwo(mins)}m${padTwoLast(secs)}s`;
};

const stirngifyDecimals = (value, digits) => {
	return Number(value.toFixed(digits)) + 'h';
};

class HoursFormatter {
	constructor(ctx, useDecimals) {
		this.ctx = ctx;
		this.useDecimals = useDecimals;
		this.digits = 6;
	}
	set(ctx) {
		return new HoursFormatter(ctx, this.useDecimals, this.digits);
	}
	hours() {
		return new HoursFormatter(this.ctx, false, this.digits);
	}
	decimal() {
		return new HoursFormatter(this.ctx, true, this.digits);
	}
	stringify(value) {
		return this.useDecimals ? stirngifyDecimals(value, this.digits) : stringifyHours(value);
	}
}

const HoursFormat = new HoursFormatter(null, true);
export default HoursFormat;
