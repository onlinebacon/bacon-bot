import VoiceChannelAdapter from './voice-channel-wrapper.js';

export default class UserAdapter {
	constructor(client, id) {
		this.client = client;
		this.id = id ?? user?.id;
	}
	isConnectedTo(vc = new VoiceChannelAdapter()) {
		return !!vc.getConnectedMember(this.id);
	}
}
