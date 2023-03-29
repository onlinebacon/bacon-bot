import { Events } from 'discord.js';
import Context from '../lib/context/Context.js';
import MessageWrapper from './message-wrapper.js';
import TextChannelWrapper from './text-channel-wrapper.js';
import UserWrapper from './user-wrapper.js';
import VoiceChannelWrapper from './voice-channel-wrapper.js';

export default class ClientWrapper {
	constructor(client) {
		this.client = client;
	}
	onMessage(handler) {
		const { client } = this;
		client.on(Events.MessageCreate, async (message) => {
			try {
				const msg = new MessageWrapper(client, message);
				const ctx = new Context({ msg });
				await handler(ctx);
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
			const user = new UserWrapper(client, curr.id);
			const vc = new VoiceChannelWrapper(client, curr.channelId);
			try {
				await handler(vc, user);
			} catch(error) {
				console.error(error);
			}
		});
	}
	getUser(userId) {
		return new UserWrapper(this.client, userId);
	}
	getTextChannel(channelId) {
		return new TextChannelWrapper(this.client, channelId);
	}
	getVoiceChannel(channelId) {
		return new VoiceChannelWrapper(this.client, channelId);
	}
}
