import crypto from 'crypto';
const sha256 = (data) => {
	if (typeof data === 'string') {
		data = Buffer.from(data, 'utf-8');
	}
	return crypto.createHash('sha256').update(data).digest();
};
const genSalt = () => crypto.randomBytes(3).toString('hex');
export const encrypt = (text, password) => {
	const salt = genSalt();
	const textBytes = Buffer.from(text, 'utf-8');
	const hashBytes = sha256(salt + password);
	for (let i=0; i<textBytes.length; ++i) {
		textBytes[i] ^= hashBytes[i];
	}
	const encrypted = textBytes.toString('hex');
	const sum = sha256(salt + encrypted).toString('hex').substring(0, 2);
	return salt + '/' + encrypted + '-' + sum;
};
export const checkSum = (value) => {
	const [ salt, encrypted, sum ] = value.split(/[\/-]/);
	const checkSum = sha256(salt + encrypted).toString('hex').substring(0, 2);
	return checkSum === sum;
};
export const decrypt = (value, password) => {
	const [ salt, encrypted ] = value.split(/[\/-]/);
	const hashBytes = sha256(salt + password);
	const textBytes = Buffer.from(encrypted, 'hex');
	for (let i=0; i<textBytes.length; ++i) {
		textBytes[i] ^= hashBytes[i];
	}
	const text = textBytes.toString('utf-8');
	return text;
};
