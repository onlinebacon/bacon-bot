import Tags from './Tags.js';

const cmdNameRegex = /^\.[a-z]+(-\w+)*/i;

const preventStyles = (str) => {
	return str.replace(/([`*_~\\])/g, '\\$1');
};

class Command {
	constructor({ name, listed, description, syntax, examples, handler, argSep }) {
		this.name = name;
		this.description = description;
		this.syntax = syntax;
		this.examples = examples;
		this.handler = handler;
		this.argSep = argSep;
		this.listed = listed;
	}
	help(ctx) {
		let text = `**.${this.name}**\n`;
		if (this.description) {
			text += `_${this.description}_\n`;
		}
		if (this.syntax) {
			text += `Syntax: \`${this.syntax}\`\n`;
		}
		if (this.examples) {
			text += 'Examples:\n';
			text += this.examples.map(preventStyles).map(s => `> ${s}`).join('\n');
		}
		return ctx.msg.reply(text);
	}
	handleBadSyntax(ctx, message) {
		let text = `**Invalid syntax**\n`;
		if (message) text += message + '\n';
		text += `Try\n\`.${this.name} --help\``;
		return ctx.msg.reply(text);
	}
}

const popTags = (text) => {
	const tags = [];
	let tag;
	while (text !== '') {
		[ tag, text ] = Tags.pop(text);
		if (tag == null) break;
		tags.push(tag);
	}
	return [ tags, text ];
};

class CommandManager {
	constructor() {
		this.map = {};
		this.list = [];
	}
	add(config) {
		const command = new Command(config);
		this.map[config.name] = command;
		this.list.push(command);
		return command;
	}
	handleHelp(ctx) {
		let text = 'Run `.COMMAND --help` to learn how to use a command\nHere is the list of commands:\n';
		for (let cmd of this.list) {
			if (!cmd.listed) continue;
			text += `**.${cmd.name}** - _${cmd.description}_\n`;
		}
		return ctx.msg.reply(text);
	}
	async handleMessage(ctx) {
		let text = ctx.msg.getText();
		if (text === '.help') {
			return this.handleHelp(ctx);
		}
		let name = text.match(cmdNameRegex)?.[0];
		if (name == null) return;
		text = text.substring(name.length).trim();
		name = name.substring(1);
		const cmd = this.map[name];
		if (!cmd) {
			return ctx.msg.reply(`Unrecognized command **${name}**`);
		}
		if (text === '--help') {
			return cmd.help(ctx);
		}
		let tags;
		[ tags, text ] = popTags(text);
		for (let str of tags) {
			const name = Tags.getName(str);
			const tag = Tags.findByName(name);
			if (tag == null) {
				return ctx.msg.reply(`Unrecognized tag **${name}**`);
			}
			const arg = Tags.getArg(str);
			const res = tag.handler(ctx, arg);
			if (res === false) {
				return ctx.msg.reply(`Invalid value for tag **${name}**`);
			}
		}
		const args = cmd.argSep ? (text ? text.split(cmd.argSep).map(val => val.trim()) : []) : text;
		await cmd.handler({ ctx, args });
	}
}

const Commands = new CommandManager();
export default Commands;
