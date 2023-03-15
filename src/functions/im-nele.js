import Config from '../config.js';

const { nele, royalUserIds } = Config;
const { voiceId, textId } = nele;

const isRoyal = ({ id }) => {
	return royalUserIds.indexOf(id) !== -1;
};

const getOtherRoyalId = ({ id }) => {
	const index = royalUserIds.indexOf(id);
	return royalUserIds[1 - index];
};

export const init = async (cli) => {
	const tc = cli.getTextChannel(textId);
	const vc = cli.getVoiceChannel(voiceId);
	cli.onJoinVoice(async (channel, user) => {
		if (!channel.equals(vc)) return;
		if (!isRoyal(user)) return;
		const other = cli.getUser(getOtherRoyalId(user));
		if (!other.isConnectedTo(vc)) {
			await tc.wipe();
			await tc.sendTextMessage(`<@${other.id}> I'm nele`);
		}
	});
};
