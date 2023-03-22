import * as Scheduler from '../lib/scheduler.js';

const SECOND = 1000;
const MINUTE = SECOND*60;
const HOUR = MINUTE*60;

const timeUnits = {
	s: SECOND,
	m: MINUTE,
	h: HOUR,
};

export const init = async (cli) => {
	cli.onMessage(async (msg) => {
		const text = msg.getText();
		if (!/^\.disconnect-in\b/.test(text)) return;
		const timeText = text.replace(/^[^\s]+\s+/, '');
		const [, value, unit ] = timeText.match(/^(\d+)\s*([a-z]+)$/) ?? [];
		if (!value || !unit) return msg.reply('Invalid time');
		const mul = timeUnits[unit];
		if (!mul) return msg.reply('Invalid time unit');
		const time = Date.now() + value*mul;
		const vc = msg.getUserConnectedChannel();
		if (!vc) return msg.reply(`I can't find any voice channel you're connected to`);
		const reply = await msg.reply(`OK. You'll be disconnected <t:${Math.round(time/1000)}:R>`);
		const user = msg.getUser();
		const tc = msg.getChannel();
		Scheduler.run('disconnect', time, {
			userId: user.id,
			vcId: vc.id,
			replyId: reply.id,
			tcId: tc.id,
		});
	});
	Scheduler.on('disconnect', async ({ userId, vcId, replyId, tcId }) => {
		console.log({ userId, vcId, replyId, tcId });
		const vc = cli.getVoiceChannel(vcId);
		const user = cli.getUser(userId);
		const tc = cli.getTextChannel(tcId);
		await vc.disconnect(user);
		await tc.deleteMessageById(replyId);
	});
};
