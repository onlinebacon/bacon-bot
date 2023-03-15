import Config from '../config.js';

export const init = (cli) => {
	cli.onMessage(async (msg) => {
		if (!msg.isFromRoot()) return;
		if (msg.getText() !== '.wipe') return;
		const channel = msg.getChannel();
		await channel.wipe();
		const tc = cli.getTextChannel(Config.reportChannelId);
		tc.sendTextMessage(`Channel **${channel.getName()}** was wiped`);
	});
};
