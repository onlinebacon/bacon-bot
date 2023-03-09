import Config from '../../config.js';
import wipeChannel from '../../shared/wipe-channel.js';

const { nele, royalUserIds } = Config;

export const init = async (client) => {
    const { voiceId, textId } = nele;
    const textChannel = client.channels.cache.get(textId);
    client.on('voiceStateUpdate', async (prev, curr) => {
        if (curr.channelId !== voiceId) return;
        if (prev.channelId === curr.channelId) return;
        const index = royalUserIds.indexOf(curr.id);
        if (index === -1) return;
        const target = royalUserIds[1 - index];
        await wipeChannel(textChannel);
        textChannel.send(`<@${target}> I'm nele`);
    });
};
