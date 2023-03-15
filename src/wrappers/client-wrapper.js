import { Events } from 'discord.js';
import MessageAdapter from './message-wrapper.js';
import TextChannelAdapter from './text-channel-wrapper.js';
import UserAdapter from './user-wrapper.js';
import VoiceChannelAdapter from './voice-channel-wrapper.js';

export default class ClientAdapter {
	constructor(client) {
		this.client = client;
	}
	onMessage(handler) {
		const { client } = this;
		client.on(Events.MessageCreate, async (message) => {
			try {
				await handler(new MessageAdapter(client, message));
			} catch(error) {
				console.error(error);
			}
		});
	}
	onJoinVoice(handler) {
		const { client } = this;
		client.on('voiceStateUpdate', async (prev, curr) => {
			if (prev.channelId === curr.channelId) return;
			if (!curr.channelId) return;
			const user = new UserAdapter(client, curr.id);
			const vc = new VoiceChannelAdapter(client, curr.channelId);
			try {
				await handler(vc, user);
			} catch(error) {
				console.error(error);
			}
		});
	}
	getUser(userId) {
		return new UserAdapter(this.client, userId);
	}
	getTextChannel(channelId) {
		return new TextChannelAdapter(this.client, channelId);
	}
	getVoiceChannel(channelId) {
		return new VoiceChannelAdapter(this.client, channelId);
	}
}
