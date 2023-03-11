import Config from '../config.js';
import * as Scheduler from '../shared/scheduler.js';
import { Events } from 'discord.js';

const SECOND = 1000;
const MINUTE = SECOND*60;
const HOUR = MINUTE*60;

export const init = async (client) => {
	client.on(Events.MessageCreate, async (event) => {
		const message = event;
		const userId = message.author.id;
		if (userId !== Config.rootId) return;
		const text = message.content;
        if (!text.startsWith('.disconnect-in ')) return;
        const timeText = text.replace(/^\.\w+-\w+\s+/, '').trim();
		const [, value, unit ] = timeText.match(/^(\d+)\s*([a-z]+)$/);
		const mul = {
			s: SECOND,
			m: MINUTE,
			h: HOUR,
		}[unit];
		if (!/^\d+$/.test(value)) {
			message.reply('Invalid time');
			return;
		}
		if (mul === undefined) {
			message.reply('Invalid time unit');
			return;
		}
		const time = Date.now() + value*mul;
		const { channelId } = message.member.voice;
		if (!channelId) {
			message.reply(`I can't find which voice channel you are`);
			return;
		}
		const textChannelId = message.channel.id;
		const { id: messageId } = await message.reply(`Ok, you'll be disconnected <t:${Math.round(time/1000)}:R>`);
		Scheduler.run('disconnect', time, { userId, channelId, messageId, textChannelId });
	});
	Scheduler.on('disconnect', ({ userId, channelId, messageId, textChannelId }) => {
		const channel = client.channels.cache.get(channelId);
		channel?.members.get(userId)?.voice?.disconnect();
		client.channels.cache.get(textChannelId).messages.delete(messageId);
	});
};
