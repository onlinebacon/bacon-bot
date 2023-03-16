import ChannelAdapter from './channel-wapper.js';
import MessageAdapter from './message-wrapper.js';

export default class TextChannelAdapter extends ChannelAdapter {
    async wipe() {
        const channel = this.getChannelObject();
        for (;;) {
            const messages = await channel.messages.fetch({ limit: 50 });
            if (messages.size == 0) return;
            const promises = [];
            messages.forEach(message => {
                promises.push(message.delete());
            });
            await Promise.all(promises);
        }
    }
    async sendTextMessage(text) {
        const msg = await this.getChannelObject().send(text);
        return new MessageAdapter(this.client, msg);
    }
    deleteMessageById(msgId) {
		return this.getChannelObject().messages.delete(msgId);
    }
}