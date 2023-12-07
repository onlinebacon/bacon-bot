import { SlashCommandBuilder } from "discord.js";

export const testCommand = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Tests the bot'),
	async execute (interaction) {
		await interaction.reply('It works!');
	},
};
