const posPrefixRegex = /^[+ne]/i;
const negPrefixRegex = /^[-sw]/i;
const posSuffixRegex = /^[ne]/i;
const negSuffixRegex = /^[sw]/i;
const sepRegex = /^(\s+|\s*[°'"]\s*)/;
const numberRegex = /^\d+(\.\d+)?/;

const unitMap = {
	'°': 1,
	'\'': 1/60,
	'"': 1/3600,
};

const DegParser = {
	parse: (text) => {
		let sign = 1;
		text = text.trim();
		if (posPrefixRegex.test(text)) {
			text = text.replace(posPrefixRegex, '').trim();
		} else if (negPrefixRegex.test(text)) {
			text = text.replace(negPrefixRegex, '').trim();
			sign = -1;
		}
		let unitVal = 1;
		let sum = 0;
		if (!numberRegex.test(text)) return NaN;
		for (;;) {
			const number = text.match(numberRegex)?.[0];
			if (number == null) break;
			text = text.replace(numberRegex, '');
			let sep = text.match(sepRegex)?.[0];
			if (sep == null) {
				sum += Number(number)*unitVal;
				break;
			}
			text = text.replace(sepRegex, '');
			sep = sep.trim();
			if (sep !== '') {
				unitVal = unitMap[sep];
			}
			sum += Number(number)*unitVal;
			unitVal /= 60;
		}
		if (posSuffixRegex.test(text)) {
			text = text.replace(posSuffixRegex, '').trim();
		} else if (negSuffixRegex.test(text)) {
			text = text.replace(negSuffixRegex, '').trim();
			sign = -1;
		}
		if (text !== '') return NaN;
		return sign*sum;
	},
};

export default DegParser;
