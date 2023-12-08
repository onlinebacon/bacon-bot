import { Collection, Events, REST, Routes } from "discord.js";
import { commands } from "./import-list.js";
import { config } from "../config.js";
import { servers } from "../servers/servers.js";
import { loadButtons } from "./load-buttons.js";

const handleChatInputCommand = async (interaction) => {
	const { commandName } = interaction;
	const command = interaction.client.commands.get(commandName);
	if (!command) {
		console.error(`No command named "${commandName}"`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch(error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
};

export const loadCommands = async (client) => {
	loadButtons(client);
	const rest = new REST().setToken(config.token);
	client.commands = new Collection();
	for (const command of commands) {
		client.commands.set(command.data.name, command);
	}
	const body = commands.map(command => {
		return command.data.toJSON();
	});
	const requests = servers.map(async (server) => {
		return rest.put(
			Routes.applicationGuildCommands(config.botId, server.id),
			{ body },
		);
	});
	await Promise.all(requests);
	client.on(Events.InteractionCreate, async (interaction) => {
		if (interaction.isChatInputCommand()) {
			handleChatInputCommand(interaction);
		}
	});
	console.log('Commands loaded');
};
