import VoiceChannelWrapper from './voice-channel-wrapper.js';

export default class UserWrapper {
	constructor(client, id) {
		this.client = client;
		this.id = id ?? user?.id;
	}
	isConnectedTo(vc = new VoiceChannelWrapper()) {
		return !!vc.getConnectedMember(this.id);
	}
}
