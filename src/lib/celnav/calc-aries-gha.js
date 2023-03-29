const BASETIME = 1656652979.9;
const SIDEREAL_DAY = 86164.09053820801;

const calcAriesGHA = (unixtime) => {
	const angle = (unixtime - BASETIME) / SIDEREAL_DAY * 360;
	return (angle % 360 + 360) % 360;
};

export default calcAriesGHA;
