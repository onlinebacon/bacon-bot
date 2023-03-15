import Config from '../config.js';

export const init = (cli) => {
	cli.onMessage(async (msg) => {
		if (!msg.isFromRoot()) return;
		const text = msg.getText();
		if (text === '.instances') {
			return msg.reply(`I'm running on \`${Config.instance}\``);
		}
		if (text.startsWith('.kill-instance ')) {
			const instance = text.replace(/\.kill-instance\s*/, '').trim();
			if (Config.instance !== instance) return;
			await msg.reply('Bye!');
			process.exit(0);
		}
	});
};
