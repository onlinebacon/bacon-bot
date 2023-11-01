const fs = require('fs');

const pathname = './data.json';

let data = {};

module.exports.load = () => {
	if (!fs.existsSync(pathname)) {
		return;
	}
	const buffer = fs.readFileSync(pathname);
	const json = buffer.toString('utf-8');
	data = JSON.parse(json);
};

module.exports.store = () => {
	const json = JSON.stringify(data);
	const buffer = Buffer.from(json, 'utf-8');
	fs.writeFileSync(pathname, buffer);
};

module.exports.obj = () => {
	return data;
};
