const unitRegex = /[a-z]+$/i;

const imperial = {
	'in': 0.0254,
	'ft': 0.3048,
	'mi': 1609.344,
};

const metric = {
	'mm': 0.001,
	'cm': 0.01,
	'm': 1,
	'km': 1000,
};

const all = {
	...imperial,
	...metric,
	'ly': 299792458*365.25*60*60*24,
};

const dict = {
	'meter': 'm',
	'meters': 'm',
	'mile': 'mi',
	'miles': 'mi',
	'foot': 'ft',
	'feet': 'ft',
};

const findUnit = (unit) => {
	if (all[unit] !== undefined) {
		return { meters: all[unit], name: unit };
	}
	const name = dict[unit];
	if (name === undefined) return null;
	const meters = all[name];
	if (meters === undefined) return null;
	return { meters, name };
};

const stringifyDigits = (val, digits) => {
	return Number(val.toPrecision(digits)).toString();
};

const stringifyWithUnit = (val, unitMap, digits) => {
	const entries = Object.entries(unitMap);
	for (let i=entries.length - 1; i>=0; --i) {
		const [ name, unitVal ] = entries[i];
		if (i === 0 || val >= unitVal) {
			return stringifyDigits(val/unitVal, digits) + ' ' + name;
		}
	}
};

class LengthUnit {
	constructor(unitMap, nDigits, mainUnit) {
		this.unitMap = unitMap;
		this.nDigits = nDigits;
		this.mainUnit = mainUnit;
	}
	parse(str) {
		const { mainUnit } = this;
		str = str.trim();
		const unitName = str.match(unitRegex)?.[0];
		str = str.replace(unitRegex, '').trim();
		const unit = unitName ? findUnit(unitName) : mainUnit;
		if (unit == null) return NaN;
		return Number(str)*unit.meters/mainUnit.meters;
	}
	use(unitName) {
		return new LengthUnit(this.unitMap, this.nDigits, findUnit(unitName));
	}
	digits(nDigits) {
		return new LengthUnit(this.unitMap, nDigits, this.mainUnit);
	}
	imperial() {
		return new LengthUnit(imperial, this.nDigits, this.mainUnit);
	}
	metric() {
		return new LengthUnit(metric, this.nDigits, this.mainUnit);
	}
	stringify(val) {
		const { mainUnit } = this;
		return stringifyWithUnit(val*mainUnit.meters, this.unitMap, this.nDigits);
	}
}

const LengthUnits = new LengthUnit(metric, 6, findUnit('m'));
export default LengthUnits;
