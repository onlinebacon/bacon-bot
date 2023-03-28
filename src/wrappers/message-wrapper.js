import Config from '../config.js';
import TextChannelWrapper from './text-channel-wrapper.js';
import VoiceChannelWrapper from './voice-channel-wrapper.js';
import UserWrapper from './user-wrapper.js';

const { rootId } = Config;

export default class MessageWrapper {
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
        return new TextChannelWrapper(client, message.channelId);
    }
    async reply(text) {
        const reply = await this.message.reply(text);
        return new MessageWrapper(this.client, reply);
    }
    getUserConnectedChannel() {
        const { channelId } = this.message.member.voice ?? {};
        if (!channelId) return null;
        return new VoiceChannelWrapper(this.client, channelId);
    }
    getUser() {
        return new UserWrapper(this.client, this.message.author.id);
    }
}
