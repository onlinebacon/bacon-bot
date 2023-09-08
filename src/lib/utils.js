export const arrayGroup = (array, groupLength) => {
	const result = [];
	let group = null;
	array.forEach((item, i) => {
		if (i % groupLength === 0) {
			group = [];
			result.push(group);
		}
		group.push(item);
	});
	return result;
};
