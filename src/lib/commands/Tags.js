const tagNameRegex = /(?<=^\[)[a-z]+/i;
const tagArgRegex = /(?<=^\[\w+:).+(?=\]$)/i;
const tagRegex = /^\[[a-z]+(:[^\]]+)?\]/i;

class Tag {
	constructor({ name, hasArg, description, examples, handler }) {
		this.name = name;
		this.hasArg = hasArg;
		this.description = description;
		this.examples = examples;
		this.handler = handler;
	}
}

class TagManager {
	constructor() {
		this.map = {};
		this.list = [];
	}
	add({ name, hasArg, description, examples, handler }) {
		const tag = new Tag({ name, hasArg, description, examples, handler });
		this.map[name] = tag;
		this.list.push(name);
		return this;
	}
	getName(tag) {
		const name = tag.match(tagNameRegex)?.[0];
		return name ?? null;
	}
	getArg(tag) {
		return tag.match(tagArgRegex)?.[0] ?? null;
	}
	findByName(name) {
		return this.map[name] ?? null;
	}
	pop(text) {
		const tag = text.match(tagRegex)?.[0];
		if (tag == null) return [ null, text ];
		text = text.substring(tag.length).trim();
		return [ tag, text ];
	}
}

const Tags = new TagManager();
export default Tags;
