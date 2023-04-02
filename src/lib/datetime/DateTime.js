const stringify = (unixtime) => {
	const datetime = new Date(unixtime*1000);
	const iso = datetime.toISOString();
	const [ date, time ] = iso.split(/[TZ.]/);
	return `${date} ${time} UTC`;
};

const DateTime = {
	stringify,
};
export default DateTime;
