const interval = 365.25*86400*1000;

const randomUnixtime = () => {
	const now = Date.now();
	const ms = interval*(Math.random() - 0.5) + now;
	const sec = ms/1000;
	const unixtime = Math.floor(sec);
	return unixtime;
};

export default randomUnixtime;
