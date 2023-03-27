const metricUnits = {
	'mm': 0.001,
	'cm': 0.01,
	'm': 1,
	'km': 1000,
	'ly': 299792458*365.25*24*60*60,
};

const imperialUnits = {
	'in': 0.0254,
	'ft': 0.3048,
	'mi': 1609.344,
};

const nauticalUnits = {
	'nm': 1852,
};

const allUnits = {
	...metricUnits,
	...imperialUnits,
	...nauticalUnits,
};

const Distance = {
	validFormat: (str) => /^\s*[-+]?\s*\d+(\.\d+)?\s*[a-z]*\s*$/i.test(str),
	containsUnit: (str) => /[a-z]+/i.test(str),
	knownUnit: (str) => allUnits[str.match(/[a-z]+/i)?.[0]] !== undefined,
	parse: (str) => {
		let number = (str.match(/^\s*[-+]?\s*\d+(\.\d+)?/)?.[0] ?? '');
		let unitName = str.substring(number.length).trim() || 'm';
		let unitVal = allUnits[unitName];
		return number.replace(/\s+/g, '')*unitVal;
	},
};

export default Distance;
