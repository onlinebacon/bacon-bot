const calcDip = (height) => {
	const mins = 1.76*Math.sqrt(height);
	return mins/60;
}

export default calcDip;
