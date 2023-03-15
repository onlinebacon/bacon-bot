import Config from '../config.js';
import TextChannelAdapter from './text-channel-wrapper.js';
import VoiceChannelAdapter from './voice-channel-wrapper.js';
import UserAdapter from './user-wrapper.js';

const { rootId } = Config;

export default class MessageAdapter {
    constructor(client, message) {
        this.client = client;
        this.message = message;
        this.id = message.id;
        this.channelId = message?.channelId;
    }
    isFromRoot() {
        const { message } = this;
		const userId = message.author.id;
		return userId === rootId;
    }
    getChannelId() {
        return this.message.channelId;
    }
    getText() {
        return this.message.content;
    }
    getChannel() {
        const { client, message } = this;
        return new TextChannelAdapter(client, message.channelId);
    }
    async reply(text) {
        const reply = await this.message.reply(text);
        return new MessageAdapter(this.client, reply);
    }
    getUserConnectedChannel() {
        const { channelId } = this.message.member.voice ?? {};
        if (!channelId) return null;
        return new VoiceChannelAdapter(this.client, channelId);
    }
    getUser() {
        return new UserAdapter(this.client, this.message.author.id);
    }
}
