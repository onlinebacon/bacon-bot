import { ButtonBuilder } from "discord.js";

const shared = (customId, action) => {
	const button = {
		customId,
		data: new ButtonBuilder()
			.setCustomId(customId),
		async execute(interaction) {
			const { message } = interaction;
			const { content } = message;
			const userId = content.match(/<@(\d+)>/)?.[1];
			if (!userId) return;
			const { guild } = message;
			const member = await guild.members.fetch(userId);
			try {
				await action(member);
				await interaction.reply({
					content: 'Done',
					ephemeral: true,
				});
			} catch (error) {
				if (error.rawError?.code === 50013) {
					await interaction.reply({
						content: 'I don\'t have permission to execute this action',
						ephemeral: true,
					});
				} else {
					throw error;
				}
			}
		},
	};
	return button;
};

export const muteUserButton = shared('mute_user', async(member) => {
	await member.voice.setMute(true, 'Reasons');
});

export const unmuteUserButton = shared('unmute_user', async(member) => {
	await member.voice.setMute(false, 'Reasons');
});
