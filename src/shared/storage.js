import fs from 'fs/promises';

const DIR = './data';

const load = async (filename) => {
	const buffer = await fs.readFile(filename);
	const json = buffer.toString('utf-8');
	const data = JSON.parse(json);
	return data;
};

const store = async (filename, data) => {
	const json = JSON.stringify(data);
	const buffer = Buffer.from(json, 'utf-8');
	await fs.writeFile(filename, buffer);
};

const loadOrEmpty = async (filename) => {
	try {
		const data = await load(filename);
		return data;
	} catch(e) {
		return {};
	}
};

const dbMap = {};

class Database {
	constructor(dbName) {
		this.filename = DIR + '/' + dbName + '.json';
		this.data = null;
		this.initCalled = false;
	}
	async save() {
		await store(this.filename, this.data);
		return this;
	}
	async init() {
		if (this.initCalled === true) return this;
		this.initCalled = true;
		this.data = await loadOrEmpty(this.filename);
		return this;
	}
}

export default class Storage {
	constructor(dbName) {
		this.database = dbMap[dbName];
		if (this.database === undefined) {
			this.database = dbMap[dbName] = new Database(dbName);
		}
	}
	get data() { return this.database.data };
	save() { return this.database.save(); }
	init() { return this.database.init(); }
}
