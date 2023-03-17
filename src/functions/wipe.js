import Config from '../config.js';

export const init = (cli) => {
	cli.onMessage(async (msg) => {
		if (!msg.isFromRoot()) return;
		const text = msg.getText().trim();
		if (!/^\.wipe(\s+\d+)?$/.test(text)) return;
		const limitStr = text.replace(/^[^\s]+\s*/, '');
		const channel = msg.getChannel();
		await channel.wipe(limitStr ? Number(limitStr) + 1: Infinity);
		const tc = cli.getTextChannel(Config.reportChannelId);
		tc.sendTextMessage(`Channel **${channel.getName()}** was wiped`);
	});
};
