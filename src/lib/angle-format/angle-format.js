const numberRegex = /^\d+(\.\d+)?/;
const degUnitRegex = /^\s*[°'"]\s*/;
const hrUnitRegex = /^\s*[hms]\s*/;
const prefixRegex = /^\s*[\-+nsew]\s*/i;
const suffixRegex = /^\s*[nsew]\s*/i;
const spaceRegex = /^\s+/;

const degUnitMap = {
	'°': 1,
	'\'': 1/60,
	'"': 1/3600,
};

const hrUnitMap = {
	h: 1,
	m: 1/60,
	s: 1/3600,
};

class StrPopper {
	constructor(str) {
		this.str = str;
	}
	pop(regex) {
		const [ top ] = this.str.match(regex) ?? [];
		if (!top) return null;
		this.str = this.str.substring(top.length);
		return top;
	}
	popTrim(regex) {
		const val = this.pop(regex);
		if (val) return val.trim();
		return null;
	}
}

const parseDegrees = (str) => {
	const popper = new StrPopper(str.trim());
	const prefix = popper.popTrim(prefixRegex);
	let sum = 0;
	let unit_val = null;
	for (;;) {
		let number = popper.pop(numberRegex);
		if (!number) break;
		let unit = popper.popTrim(degUnitRegex);
		if (unit) {
			unit_val = degUnitMap[unit];
		} else {
			popper.pop(spaceRegex);
			if (!unit_val) {
				unit_val = 1;
			} else {
				unit_val /= 60;
			}
		}
		sum += Number(number)*unit_val;
	}
	const suffix = popper.popTrim(suffixRegex);
	if (popper.str) return NaN;
	if (suffix && prefix) return NaN;
	if (unit_val === null) return NaN;
	const sign = prefix ?? suffix ?? '+';
	const neg = /[-sw]/i.test(sign);
	return neg ? - sum : sum;
};

const parseHours = (str) => {
	const popper = new StrPopper(str.trim());
	let sum = 0;
	let unit_val = null;
	for (;;) {
		let number = popper.pop(numberRegex);
		if (!number) break;
		let unit = popper.popTrim(hrUnitRegex);
		if (unit) {
			unit_val = hrUnitMap[unit];
		} else {
			popper.pop(spaceRegex);
			if (!unit_val) {
				unit_val = 1;
			} else {
				unit_val /= 60;
			}
		}
		sum += Number(number)*unit_val;
	}
	if (popper.str) return NaN;
	if (unit_val === null) return NaN;
	return sum;
};

const degrees = {
	parse: parseDegrees,
	stringify: (angle) => {
		let total = Math.round(Math.abs(angle)*60*60*10);
		let prefix = angle >= 0 ? '' : '-';
		let sec = (total%600)/10;
		total = total/600 | 0;
		let min = total%60;
		let deg = total/60 | 0;
		let res = prefix;
		res += deg + '°';
		res += min.toString().padStart(2, '0') + '\'';
		res += sec.toString().replace(/^(\d\b)/, '0$1') + '"';
		return res;
	},
	hours: null,
	degrees: null,
};

const hours = {
	parse: parseHours,
	stringify: (hours) => {
		if (hours < 0 || isNaN(hours)) return `Invalid hour angle`;
		let total = Math.round(hours*3600*10);
		let s = (total%600)/10;
		total = total/600 | 0;
		let m = total%60;
		let h = total/60 | 0;
		let res = '';
		res += h.toString().padStart(2, '0') + 'h';
		res += m.toString().padStart(2, '0') + 'm';
		res += s.toString().replace(/^(\d\b)/, '0$1') + 's';
		return res;
	},
	hours: null,
	degrees: null,
};

degrees.hours = hours;
degrees.degrees = degrees;
hours.hours = hours;
hours.degrees = degrees;

const Angle = degrees;

export default Angle;
