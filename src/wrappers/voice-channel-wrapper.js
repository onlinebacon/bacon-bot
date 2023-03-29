import ChannelWrapper from './channel-wapper.js';

export default class VoiceChannelWrapper extends ChannelWrapper {
	getConnectedMember(id) {
		return this.getChannelObject().members.get(id);
	}
	disconnect(user) {
		return this.getConnectedMember(user.id)?.voice?.disconnect();
	}
}
