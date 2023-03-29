import ChannelWrapper from './channel-wapper.js';
import MessageWrapper from './message-wrapper.js';

export default class TextChannelWrapper extends ChannelWrapper {
    async wipe(count = Infinity) {
        const channel = this.getChannelObject();
        for (;;) {
            const messages = await channel.messages.fetch({ limit: Math.min(count, 50) });
            if (messages.size == 0) return;
            const promises = [];
            messages.forEach(message => {
                promises.push(message.delete());
            });
            await Promise.all(promises);
            count -= promises.length;
            if (count <= 0) return;
        }
    }
    async sendTextMessage(text) {
        const msg = await this.getChannelObject().send(text);
        return new MessageWrapper(this.client, msg);
    }
    deleteMessageById(msgId) {
		return this.getChannelObject().messages.delete(msgId);
    }
}
