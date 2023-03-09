import Config from '../../config.js';
import { Events } from 'discord.js';
import wipeChannel from '../../shared/wipe-channel.js';

export const init = async (client) => {
	const reportChannel = client.channels.cache.get(Config.reportChannelId);
	client.on(Events.MessageCreate, async (event) => {
		const message = event;
		const userId = message.author.id;
		if (userId !== Config.rootId) return;
		const text = message.content;
		if (text !== '.wipe') return;
		const channel = client.channels.cache.get(message.channelId);
		await wipeChannel(channel);
		reportChannel.send(`<@${Config.rootId}> channel \`${message.channelId}\` wiped`);
	});
};
