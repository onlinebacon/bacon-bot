const shuffle = (array) => {
	const res = array.slice();
	for (let i = res.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random()*(i + 1));
		const temp = res[i];
		res[i] = res[j];
		res[j] = temp;
	}
	return res;
};

export default shuffle;
