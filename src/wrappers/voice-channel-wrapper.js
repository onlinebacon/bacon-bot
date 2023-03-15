import ChannelAdapter from './channel-wapper.js';

export default class VoiceChannelAdapter extends ChannelAdapter {
	getConnectedMember(id) {
		return this.getChannelObject().members.get(id);
	}
	disconnect(user) {
		return this.getConnectedMember(user.id)?.voice?.disconnect();
	}
}
