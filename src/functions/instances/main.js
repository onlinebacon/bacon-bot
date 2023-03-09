import Config from '../../config.js';
import { Events } from 'discord.js';

export const init = async (client) => {
	client.on(Events.MessageCreate, async (event) => {
		const message = event;
		const userId = message.author.id;
		if (userId !== Config.rootId) return;
		const text = message.content;
		if (text === '.instances') {
            const channel = client.channels.cache.get(message.channelId);
            channel.send(`I'm running on \`${Config.instance}\``);
        }
	});
};
