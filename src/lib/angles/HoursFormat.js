import { abs, round, padTwo, padTwoLast } from './utils.js';

const HoursFormat = {
	stringify: (value) => {
		const totalSecs = round(abs(value)*36000)/10;
		const secs = totalSecs % 60;
		const totalMins = round((totalSecs - secs)/60);
		const mins = totalMins % 60;
		const hours = round((totalMins - mins)/60);
		return `${hours}h${padTwo(mins)}m${padTwoLast(secs)}s`;
	},
};

export default HoursFormat;
