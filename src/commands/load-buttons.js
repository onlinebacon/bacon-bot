import { Collection, Events } from "discord.js";
import { buttons } from "./import-list.js";

export const loadButtons = (client) => {
	client.buttons = new Collection();
	for (const button of buttons) {
		client.buttons.set(button.customId, button);
	}
	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isButton()) return;
		const button = client.buttons.get(interaction.customId);
		if (!button) return;
		try {
			await button.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while running this action!',
				ephemeral: true,
			});
		}
	});
	console.log('Buttons loaded');
};
