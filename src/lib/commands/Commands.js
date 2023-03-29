const nameRegex = /^\.[a-z]+(-\w+)*/i;
const flagRegex = /^#[a-z]+(:\w+)?/i;

const preventStyles = (str) => {
	return str.replace(/([`*_~\\])/g, '\\$1');
};

class Command {
	constructor({ name, description, syntax, examples, handler, argSep }) {
		this.name = name;
		this.description = description;
		this.syntax = syntax;
		this.examples = examples;
		this.handler = handler;
		this.argSep = argSep;
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
	handleBadSyntax(ctx) {
		return ctx.msg.reply(`**Invalid syntax**\nTry\n\`.${this.name} --help\``);
	}
}

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
	async handleMessage(ctx) {
		let text = ctx.msg.getText();
		let name = text.match(nameRegex)?.[0];
		if (name == null) return;
		text = text.substring(name.length).trim();
		name = name.substring(1);
		const cmd = this.map[name];
		if (!cmd) {
			await ctx.msg.reply(`Unrecognized command **${name}**`);
			return;
		}
		if (text === '--help') {
			return cmd.help(ctx);
		}
		for (;;) {
			let flag = text.match(flagRegex)?.[0];
			if (flag == null) break;
			text = text.substring(flag.length).trim();
			flag = flag.substring(1);
			if (!ctx.flagIsKnown(flag)) {
				await ctx.msg.reply(`Unrecognized flag **${flag}**`);
				return;
			}
			ctx.applyFlag(flag);
		}
		const args = cmd.argSep ? (text ? text.split(cmd.argSep) : []) : text;
		await cmd.handler({ ctx, args });
	}
}

const Commands = new CommandManager();

export default Commands;