import Config from '../config.js';
import wipeChannel from '../shared/wipe-channel.js';

const { nele, royalUserIds } = Config;

export const init = async (client) => {
	const { voiceId, textId } = nele;
	const textChannel = client.channels.cache.get(textId);
	const channel = client.channels.cache.get(voiceId);
	client.on('voiceStateUpdate', async (prev, curr) => {
		if (curr.channelId !== voiceId) return;
		if (prev.channelId === curr.channelId) return;
		const index = royalUserIds.indexOf(curr.id);
		if (index === -1) return;
		const userId = royalUserIds[1 - index];
		if (!channel?.members.get(userId)) {
			await wipeChannel(textChannel);
			textChannel.send(`<@${userId}> I'm nele`);
		}
	});
};
