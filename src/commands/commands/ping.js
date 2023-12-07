import { Command } from "../model.js";

export const pingCommand = new Command({
	name: 'ping',
	description: 'Pongs back',
	run: async (interaction) => {
		await interaction.reply('Pong!');
	},
})
