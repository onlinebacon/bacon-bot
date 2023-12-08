import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";
import { muteUserButton, unmuteUserButton } from "../buttons/mute-user.js";

export const micCtrlCommand = {
	data: new SlashCommandBuilder()
		.setName('mic-ctrl')
		.setDescription('Creates a user specific mic control')
		.addUserOption(option => option.setName('target_user').setDescription('User')),

	async execute(interaction) {
		const target = interaction.options.getUser('target_user');
		if (!target) {
			await interaction.reply('**Error:** Missing user argument');
			return;
		}

		const mute = new ButtonBuilder()
			.setCustomId(muteUserButton.customId)
			.setLabel('Mute')
			.setStyle(ButtonStyle.Danger);

		const unmute = new ButtonBuilder()
			.setCustomId(unmuteUserButton.customId)
			.setLabel('Unmute')
			.setStyle(ButtonStyle.Primary);
		
		const row = new ActionRowBuilder()
			.addComponents(mute, unmute);

		await interaction.reply({
			content: `Mic control for ${target}`,
			components: [ row ],
		})
	},
};
